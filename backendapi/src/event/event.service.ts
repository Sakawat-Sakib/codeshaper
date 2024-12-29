import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateEventDto } from './dto/event.dto';

@Injectable()
export class EventService {
    private readonly EVENTS_CACHE_KEY = 'events:all';
    private readonly EVENT_CACHE_PREFIX = 'event:';
    private readonly CACHE_TTL = 3600; // Cache for 1 hour

    constructor(
        private databaseService: DatabaseService,
        private redisService: RedisService
    ){}

    async createEvent(createEventDto: CreateEventDto) {
        const date = new Date(createEventDto.date); //format: "2024-12-31T12:30:00+06:00"
        
        if (isNaN(date.getTime())) {
            throw new BadRequestException("Invalid date format. Please provide a valid ISO-8601 date.");
        }

        const overLapped = await this.databaseService.event.findFirst({
            where: { date },
        });

        if(overLapped){
            throw new BadRequestException("Slot have already taken");
        }

        const newEvent = await this.databaseService.event.create({
            data: {
                ...createEventDto,
                date,
            },
        });

        // Invalidate the all events cache when a new event is created
        await this.redisService.del(this.EVENTS_CACHE_KEY);

        return newEvent;
    }

    async allEventsList() {
        // Try to get events from cache first
        const cachedEvents = await this.redisService.get(this.EVENTS_CACHE_KEY);
        
        if (cachedEvents) {
            return cachedEvents;
        }

        // If not in cache, get from database
        const eventsList = await this.databaseService.event.findMany();
        
        // Store in cache
        await this.redisService.set(this.EVENTS_CACHE_KEY, eventsList, this.CACHE_TTL);
        
        return eventsList;
    }

    async singleEvent(id: string) {
        // Try to get from cache first
        const cacheKey = `${this.EVENT_CACHE_PREFIX}${id}`;
        const cachedEvent = await this.redisService.get(cacheKey);
        
        if (cachedEvent) {
            return cachedEvent;
        }

        // If not in cache, get from database
        const event = await this.databaseService.event.findUnique({
            where: { id },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }

        // Store in cache
        await this.redisService.set(cacheKey, event, this.CACHE_TTL);
        
        return event;
    }

    async deleteEvent(id: string) {
        try {
            const deletedEvent = await this.databaseService.event.delete({
                where: { id },
            });

            // Invalidate both the specific event cache and the all events cache
            const cacheKey = `${this.EVENT_CACHE_PREFIX}${id}`;
            await Promise.all([
                this.redisService.del(cacheKey),
                this.redisService.del(this.EVENTS_CACHE_KEY)
            ]);

            return deletedEvent;
        } catch (error) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
    }
}