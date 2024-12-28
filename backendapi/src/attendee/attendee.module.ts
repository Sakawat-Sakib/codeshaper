import { Module } from '@nestjs/common';
import { AttendeeController } from './attendee.controller';
import { AttendeeService } from './attendee.service';
import { DatabaseModule } from 'src/database/database.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [DatabaseModule,RedisModule],
  controllers: [AttendeeController],
  providers: [AttendeeService]
})
export class AttendeeModule {}
