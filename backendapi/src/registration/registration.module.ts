import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { DatabaseModule } from 'src/database/database.module';
import { RedisModule } from 'src/redis/redis.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [DatabaseModule,RedisModule,EmailModule],
  providers: [RegistrationService],
  controllers: [RegistrationController]
})
export class RegistrationModule {}
