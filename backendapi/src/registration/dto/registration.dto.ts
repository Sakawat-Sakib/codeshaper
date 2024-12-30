
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistrationDto {
    @ApiProperty({ description: 'The UUID of the event', format: 'uuid' })
    @IsUUID()
    eventId: string;

    @ApiProperty({ description: 'The UUID of the attendee', format: 'uuid' })
    @IsUUID()
    attendeeId: string;
}