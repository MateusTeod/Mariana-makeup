import { IsString, MinLength, IsOptional } from 'class-validator';

export class RefreshDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  refreshToken?: string;
}
