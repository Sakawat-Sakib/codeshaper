import { Controller, Body,Delete, Get, Param, Patch, Post, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { CreateAttendeeDto } from './dto/attendee.dto';

@Controller('attendee')
export class AttendeeController {
    constructor(private readonly attendeeService: AttendeeService){}

    @Post() //add attendee
    async create(@Body(ValidationPipe) createAttendeeDto: CreateAttendeeDto){
        return await this.attendeeService.create(createAttendeeDto)
    }

    @Get() //get all attendee
    async findAll(){
        return await this.attendeeService.findAll()
    }

    @Get(':id') //GET /users/:id
    async findOne(@Param('id') id: string){
        return await this.attendeeService.findOne(id) 
    }

    @Delete(':id')
    async deleteOne(@Param('id') id: string){
        return await this.attendeeService.deleteOne(id)
    }

}
