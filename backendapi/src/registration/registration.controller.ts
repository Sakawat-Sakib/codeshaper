import { Body, Controller, Delete, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/registration.dto';

@Controller('registrations')
export class RegistrationController {
    constructor(private registrationService: RegistrationService) {}

    @Post()
    async registerAttendee(@Body(ValidationPipe) createRegistrationDto: CreateRegistrationDto) {
        return await this.registrationService.createRegistration(createRegistrationDto);
    }

    @Get(':eventId')
    async getEventRegistrations(@Param('eventId') eventId: string) {
        return await this.registrationService.getEventRegistrations(eventId);
    }

    @Delete(':id')
    async cancelRegistration(@Param('id') id: string) {
        return await this.registrationService.cancelRegistration(id);
    }
}