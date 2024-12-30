import { Body, Controller, Delete, Get, Param, Post,ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/event.dto';


@ApiTags('event')
@Controller('event')
export class EventController {
    constructor(private eventService:EventService){}


    //create event 
    @Post()
    @ApiOperation({ summary: 'Create new event' })
    @ApiBody({ 
        type: CreateEventDto,
        description: 'Event creation payload',
        examples: {
            example1: {
                value: {
                    name: "Tech Conference 2024",
                    description: "Annual technology conference",
                    date: "2024-12-31T12:30:00+06:00",
                    location: "Convention Center",
                    maxAttendees: 100
                }
            }
        }
    })
    @ApiResponse({ status: 201, description: 'The event has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
    async createEvent(@Body(ValidationPipe) createEventDto:CreateEventDto){
        return await this.eventService.createEvent(createEventDto)
    }

    //list of all events
    @Get()
    @ApiOperation({ summary: 'Get all events' })
    @ApiResponse({ status: 200, description: 'Return all events.' })
    async allEventsList(){
        return await this.eventService.allEventsList()
    }

    //details of single events
    @Get(":id")
    @ApiOperation({ summary: 'Get event by id' })
    @ApiResponse({ status: 200, description: 'Return the event details.' })
    @ApiResponse({ status: 404, description: 'Event not found.' })
    async singleEvent(@Param("id") id:string){
        return await this.eventService.singleEvent(id)
    }

    //delete event
    @Delete(":id")
    @ApiOperation({ summary: 'Delete event by id' })
    @ApiResponse({ status: 200, description: 'Event has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Event not found.' })
    async deleteEvent(@Param("id") id:string){
        return await this.eventService.deleteEvent(id)
    }

}
