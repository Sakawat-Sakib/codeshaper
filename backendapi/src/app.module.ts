import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { EventModule } from './event/event.module';
import { AttendeeModule } from './attendee/attendee.module';
import { RegistrationModule } from './registration/registration.module';
import { EmailModule } from './email/email.module';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
        redis: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          username: process.env.REDIS_USERNAME,
          password: process.env.REDIS_PASSWORD
      },
    }),
    DatabaseModule, 
    RedisModule, 
    EventModule,
    AttendeeModule, 
    RegistrationModule, 
    EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
