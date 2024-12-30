import { 
  IsString, 
  IsOptional, 
  IsDateString, 
  IsInt, 
  Min, 
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ description: 'The name of the event' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ description: 'The description of the event', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The date of the event', example: '2024-12-31T12:30:00+06:00' })
  @IsDateString()
  @IsNotEmpty({ message: 'Date is required' })
  date: string;

  @ApiProperty({ description: 'The location of the event', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'Maximum number of attendees allowed', minimum: 1 })
  @IsInt({ message: 'Maximum attendees must be an integer' })
  @Min(1, { message: 'Maximum attendees must be at least 1' })
  @IsNotEmpty({ message: 'Maximum attendees is required' })
  maxAttendees: number;
}
