## Project setup :

  #step 1: install packages :
    - npm install


  #step 2: set environment variables in .env file :

    DATABASE_URL= "postgreSQL database url"

    REDIS_USERNAME="in my case : default"
    REDIS_PASSWORD="in my case : 4nBBZzzwyOBruUwlL2nv28tUS1tM2zOW"
    REDIS_HOST="in my case : redis-19018.c301.ap-south-1-1.ec2.redns.redis-cloud.com"
    REDIS_PORT="in my case : 19018"

    NOTE: I have used redis cloud.


    EMAIL_USER="in my case : sakib.zero.one@gmail.com"
    EMAIL_PASSWORD= "this can be generated in Google account, in my case : ikxp ctte ucun lhrh"

  #step 3: generate Prisma client :
    npx prisma generate
    npx prisma migrate dev --name init

  #step 4: (Last step)
    nest start


## Update : I have created API documentation using Swagger. You can access it by going to http://localhost:3000/api-docs. 


## API end points example : 
  #Event Module :

    POST /event: Create a new event. 
      example payload : {
        "name" : "31st Night",
        "description" : "Anything",
        "location" : "Anything",
        "date" : "2024-12-31T12:30:00+06:00", (make sure to use this format)
        "maxAttendees" : "Any positive number"
      }

    GET /event: List all events.
    GET /event/:id: Retrieve event details. 
    DELETE /event/:id: Delete an event.

  #Attendee Module :

    POST /attendee: Add a new attendee.
      example payload : {
        "name" : "Any name",
        "email" : "Valid email"
      }

    GET /attendee: List all attendees.
    GET /attendee/:id: Retrieve attendee details.
    DELETE /attendee/:id: Delete an attendee.

  #Registration Module :
  
    POST /registrations: Register an attendee for an event.
      example payload : {
        "attendeeId" : "attendee id",
        "eventId" : "event id"
      }

    GET /registrations/:event_id: List all registrations for an event.
    DELETE /registrations/:id: Cancel a registration.




  ## Description :
  
    # I have used ->
    - Prisma for database management.
    - Redis for caching.
    - BullJS for background jobs.
    - nodemailer for sending emails.
    - @nestjs/schedule to send reminders

    # I have ensured ->
    - maxAttendees is a positive integer.
    - Prevent overlapping events by validating the date.
    - Unique emails for attendees.
    - Total number of registrations doesn’t exceed maxAttendees
    - Prevent attendees from registering for the same event multiple times.
    - Meaningful HTTP responses.
    - Cache invalidation for Create or deletions.


