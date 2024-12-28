import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { EventModule } from './event/event.module';
import { AttendeeModule } from './attendee/attendee.module';
import { RegistrationModule } from './registration/registration.module';

@Module({
  imports: [DatabaseModule, RedisModule, EventModule, AttendeeModule, RegistrationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
