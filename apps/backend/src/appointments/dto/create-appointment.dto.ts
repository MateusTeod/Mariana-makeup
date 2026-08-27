import { IsString, IsOptional, IsDateString, IsEmail, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  serviceId: string;

  @IsDateString()
  startAt: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone must be a valid international phone number',
  })
  phone: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
