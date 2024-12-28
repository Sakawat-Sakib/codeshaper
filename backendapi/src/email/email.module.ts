// src/email/email.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'email-queue',
        }),
    ],
    providers: [EmailProcessor],
    exports: [BullModule],
})
export class EmailModule {}