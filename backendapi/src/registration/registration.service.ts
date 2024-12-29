import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateRegistrationDto } from './dto/registration.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RegistrationService {
    private readonly REGISTRATION_CACHE_PREFIX = 'event-registrations:';
    private readonly CACHE_TTL = 3600; // 1 hour

    constructor(
        private databaseService: DatabaseService,
        private redisService: RedisService,
        @InjectQueue('email-queue') private emailQueue: Queue
    ) {}

    async createRegistration(createRegistrationDto: CreateRegistrationDto) {
        // Check if event exists
        const event = await this.databaseService.event.findUnique({
            where: { id: createRegistrationDto.eventId },
            include: { registrations: true }
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        // Check if attendee exists
        const attendee = await this.databaseService.attendee.findUnique({
            where: { id: createRegistrationDto.attendeeId }
        });

        if (!attendee) {
            throw new NotFoundException('Attendee not found');
        }

        // Check if maximum attendees limit reached
        if (event.registrations.length >= event.maxAttendees) {
            throw new BadRequestException('Event has reached maximum capacity');
        }

        // Check for duplicate registration
        const existingRegistration = await this.databaseService.registration.findFirst({
            where: {
                eventId: createRegistrationDto.eventId,
                attendeeId: createRegistrationDto.attendeeId
            }
        });

        if (existingRegistration) {
            throw new BadRequestException('Attendee is already registered for this event');
        }

        // Create registration
        const registration = await this.databaseService.registration.create({
            data: {
                eventId: createRegistrationDto.eventId,
                attendeeId: createRegistrationDto.attendeeId
            },
            include: {
                attendee: true,
                event: true
            }
        });

        // Invalidate cache
        await this.redisService.del(
            `${this.REGISTRATION_CACHE_PREFIX}${createRegistrationDto.eventId}`
        );

        //Add email job to queue
        await this.emailQueue.add('registration-confirmation', {
            attendee: {
                name: registration.attendee.name,
                email: registration.attendee.email
            },
            event: {
                name: registration.event.name,
                date: registration.event.date,
                location: registration.event.location,
                description: registration.event.description
            }
        }, {
            attempts: 2,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        });

        return registration;
    }

    async getEventRegistrations(eventId: string) {
        // Try to get from cache
        const cacheKey = `${this.REGISTRATION_CACHE_PREFIX}${eventId}`;
        const cachedRegistrations = await this.redisService.get(cacheKey);

        if (cachedRegistrations) {
            return cachedRegistrations;
        }

        // Check if event exists
        const event = await this.databaseService.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        // Get registrations from database
        const registrations = await this.databaseService.registration.findMany({
            where: { eventId },
            include: {
                attendee: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                registeredAt: 'desc'
            }
        });

        // Store in cache
        await this.redisService.set(cacheKey, registrations, this.CACHE_TTL);

        return registrations;
    }

    async cancelRegistration(id: string) {
        try {
            // Get registration to find eventId for cache invalidation
            const registration = await this.databaseService.registration.findUnique({
                where: { id }
            });

            if (!registration) {
                throw new NotFoundException('Registration not found');
            }

            // Delete registration
            const deletedRegistration = await this.databaseService.registration.delete({
                where: { id },
                include: {
                    attendee: true,
                    event: true
                }
            });

            // Invalidate cache
            await this.redisService.del(
                `${this.REGISTRATION_CACHE_PREFIX}${registration.eventId}`
            );

            return deletedRegistration;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Failed to cancel registration');
        }
    }

    @Cron(CronExpression.EVERY_HOUR)
    async scheduleEventReminders() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

        // Find events happening tomorrow that haven't had reminders sent
        const upcomingEvents = await this.databaseService.event.findMany({
            where: {
                date: {
                    gte: tomorrow,
                    lt: dayAfterTomorrow
                },
                reminderSent: false
            },
            include: {
                registrations: {
                    include: {
                        attendee: true
                    }
                }
            }
        });

        for (const event of upcomingEvents) {
            // Schedule reminder emails for each registered attendee
            for (const registration of event.registrations) {
                await this.emailQueue.add(
                    'event-reminder',
                    {
                        attendee: {
                            name: registration.attendee.name,
                            email: registration.attendee.email
                        },
                        event: {
                            name: event.name,
                            date: event.date,
                            location: event.location,
                            description: event.description
                        }
                    },
                    {
                        attempts: 3,
                        backoff: {
                            type: 'exponential',
                            delay: 1000
                        }
                    }
                );
            }

            // Mark event as having sent reminders
            await this.databaseService.event.update({
                where: { id: event.id },
                data: { reminderSent: true }
            });
        }
    }
}