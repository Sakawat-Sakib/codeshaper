import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class EventService {
    constructor(
        private databaseService: DatabaseService,
        private redisService: RedisService
    ){}

    
}
