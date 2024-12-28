import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateAttendeeDto } from './dto/attendee.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AttendeeService {
    constructor(
        private databaseService: DatabaseService,
        private redisService: RedisService
    ) {}

    // Cache keys
    private getAttendeeKey(id: string) {
        return `attendee:${id}`;
    }
    private getAllAttendeesKey = 'attendees:all';

    // Add attendee
    async create(createAttendeeDto: CreateAttendeeDto) {
        const existingAttendee = await this.databaseService.attendee.findUnique({
            where: { email: createAttendeeDto.email },
        });

        if (existingAttendee) {
            throw new BadRequestException('Email already exists');
        }

        const newAttendee = await this.databaseService.attendee.create({
            data: createAttendeeDto
        });

        // Cache the new attendee
        await this.redisService.set(
            this.getAttendeeKey(newAttendee.id), 
            newAttendee,
            3600 // Cache for 1 hour
        );

        // Invalidate the all attendees cache since we added a new one
        await this.redisService.del(this.getAllAttendeesKey);

        return newAttendee;
    }

    async findAll() {
        // Try to get from cache first
        const cachedAttendees = await this.redisService.get(this.getAllAttendeesKey);
        if (cachedAttendees) {
            return cachedAttendees;
        }

        // If not in cache, get from database
        const attendees = await this.databaseService.attendee.findMany();

        // Store in cache for 1 hour
        await this.redisService.set(
            this.getAllAttendeesKey, 
            attendees,
            3600
        );

        return attendees;
    }

    async findOne(id: string) {
        // Try to get from cache first
        const cachedAttendee = await this.redisService.get(this.getAttendeeKey(id));
        if (cachedAttendee) {
            return cachedAttendee;
        }

        // If not in cache, get from database
        const attendee = await this.databaseService.attendee.findUnique({
            where: { id }
        });

        if (!attendee) {
            throw new NotFoundException(`Attendee with ID ${id} not found`);
        }

        // Store in cache for 1 hour
        await this.redisService.set(
            this.getAttendeeKey(id), 
            attendee,
            3600
        );

        return attendee;
    }

    async deleteOne(id: string) {
        try {
            const attendee = await this.databaseService.attendee.delete({
                where: { id }
            });

            // Remove from cache
            await this.redisService.del(this.getAttendeeKey(id));
            // Invalidate the all attendees cache
            await this.redisService.del(this.getAllAttendeesKey);

            return attendee;
        } catch (error) {
            throw new NotFoundException(`Attendee with ID ${id} not found`);
        }
    }

    
}