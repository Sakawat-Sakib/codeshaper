import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseIntPipe,ValidationPipe } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/event.dto';
@Controller('event')
export class EventController {
    constructor(private eventService:EventService){}


    //create event 
    @Post()
    async createEvent(@Body(ValidationPipe) createEventDto:CreateEventDto){
        return await this.eventService.createEvent(createEventDto)
    }

    //list of all events
    @Get()
    async allEventsList(){
        return await this.eventService.allEventsList()
    }

    //details of single events
    @Get(":id")
    async singleEvent(@Param("id") id:string){
        return await this.eventService.singleEvent(id)
    }

    //delete event
    @Delete(":id")
    async deleteEvent(@Param("id") id:string){
        return await this.eventService.deleteEvent(id)
    }

}
