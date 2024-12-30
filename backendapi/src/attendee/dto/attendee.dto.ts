import {IsString, IsNotEmpty, IsEmail} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateAttendeeDto{

    @ApiProperty({ description: 'The name of the attendee' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The email of the attendee' })
    @IsEmail()
    email: string;
}