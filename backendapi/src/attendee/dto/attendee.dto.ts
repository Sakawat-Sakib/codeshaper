import {IsString, IsNotEmpty, IsEmail} from 'class-validator'

export class CreateAttendeeDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;
}