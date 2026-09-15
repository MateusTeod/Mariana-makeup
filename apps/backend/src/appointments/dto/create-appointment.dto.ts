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
  @Matches(/^[+]?[0-9\s\-()]{8,20}$/, {
    message: 'Telefone deve ser válido (ex: 11 99999-9999)',
  })
  phone: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
