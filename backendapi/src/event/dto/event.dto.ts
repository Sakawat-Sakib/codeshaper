import { 
  IsString, 
  IsOptional, 
  IsDateString, 
  IsInt, 
  Min, 
  IsNotEmpty,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Date is required' })
  date: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt({ message: 'Maximum attendees must be an integer' })
  @Min(1, { message: 'Maximum attendees must be at least 1' })
  @IsNotEmpty({ message: 'Maximum attendees is required' })
  maxAttendees: number;
}
