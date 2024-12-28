import { Controller, Body,Delete, Get, Param, Patch, Post, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { AttendeeService } from './attendee.service';
import { CreateAttendeeDto } from './dto/attendee.dto';

@Controller('attendee')
export class AttendeeController {
    constructor(private readonly attendeeService: AttendeeService){}

    @Post() //add attendee
    create(@Body(ValidationPipe) createAttendeeDto: CreateAttendeeDto){
        return this.attendeeService.create(createAttendeeDto)
    }

    @Get() //get all attendee
    findAll(){
        return this.attendeeService.findAll()
    }

    @Get(':id') //GET /users/:id
    findOne(@Param('id') id: string){
        return this.attendeeService.findOne(id) 
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string){
        return this.attendeeService.deleteOne(id)
    }

}
