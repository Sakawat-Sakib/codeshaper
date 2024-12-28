import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { DatabaseModule } from 'src/database/database.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [DatabaseModule,RedisModule],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}
