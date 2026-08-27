import { IsString, IsNumber, IsOptional, IsPositive, Min, Max } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(15)
  @Max(480)
  duration: number;

  @IsOptional()
  @IsString()
  image?: string;
}
