import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseIntPipe,ValidationPipe } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/event.dto';
@Controller('event')
export class EventController {
    constructor(private eventService:EventService){}


    //create event 
    @Post()
    createEvent(@Body(ValidationPipe) createEventDto:CreateEventDto){
        return this.eventService.createEvent(createEventDto)
    }

    //list of all events
    @Get()
    allEventsList(){
        return this.eventService.allEventsList()
    }

    //details of single events
    @Get(":id")
    singleEvent(@Param("id") id:string){
        return this.eventService.singleEvent(id)
    }

    //delete event
    @Delete(":id")
    deleteEvent(@Param("id") id:string){
        return this.eventService.deleteEvent(id)
    }

}
