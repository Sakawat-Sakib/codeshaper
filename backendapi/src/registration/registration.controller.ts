import { Body, Controller, Delete, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/registration.dto';

@ApiTags('registrations')
@Controller('registrations')
export class RegistrationController {
    constructor(private registrationService: RegistrationService) {}

    @Post()
    @ApiOperation({ summary: 'Register an attendee for an event' })
    @ApiResponse({ status: 201, description: 'The registration has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
    @ApiResponse({ status: 409, description: 'Conflict - Registration already exists or event is full.' })
    async registerAttendee(@Body(ValidationPipe) createRegistrationDto: CreateRegistrationDto) {
        return await this.registrationService.createRegistration(createRegistrationDto);
    }

    @Get(':eventId')
    @ApiOperation({ summary: 'Get all registrations for an event' })
    @ApiResponse({ status: 200, description: 'Return all registrations for the specified event.' })
    @ApiResponse({ status: 404, description: 'Event not found.' })
    async getEventRegistrations(@Param('eventId') eventId: string) {
        return await this.registrationService.getEventRegistrations(eventId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Cancel a registration' })
    @ApiResponse({ status: 200, description: 'Registration has been successfully cancelled.' })
    @ApiResponse({ status: 404, description: 'Registration not found.' })
    async cancelRegistration(@Param('id') id: string) {
        return await this.registrationService.cancelRegistration(id);
    }
}