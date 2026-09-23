import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(15)
  @Max(480)
  duration: number;

  @IsOptional()
  @IsString()
  image?: string;
}
