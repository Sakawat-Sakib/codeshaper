import { Controller, Body,Delete, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AttendeeService } from './attendee.service';
import { CreateAttendeeDto } from './dto/attendee.dto';

@ApiTags('attendee')
@Controller('attendee')
export class AttendeeController {
    constructor(private readonly attendeeService: AttendeeService){}

    @Post() //add attendee
    @ApiOperation({ summary: 'Create new attendee' })
    @ApiResponse({ status: 201, description: 'The attendee has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(@Body(ValidationPipe) createAttendeeDto: CreateAttendeeDto){
        return await this.attendeeService.create(createAttendeeDto)
    }

    @Get() //get all attendee
    @ApiOperation({ summary: 'Get all attendees' })
    @ApiResponse({ status: 200, description: 'Return all attendees.' })
    async findAll(){
        return await this.attendeeService.findAll()
    }

    @Get(':id') //GET /users/:id
    @ApiOperation({ summary: 'Get attendee by id' })
    @ApiResponse({ status: 200, description: 'Return the attendee.' })
    @ApiResponse({ status: 404, description: 'Attendee not found.' })
    async findOne(@Param('id') id: string){
        return await this.attendeeService.findOne(id) 
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete attendee by id' })
    @ApiResponse({ status: 200, description: 'Attendee has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Attendee not found.' })
    async deleteOne(@Param('id') id: string){
        return await this.attendeeService.deleteOne(id)
    }

}
