import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, and number or special character',
  })
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+]?[0-9\s\-()]{8,20}$/, {
    message: 'Telefone deve ser válido (ex: 11 99999-9999)',
  })
  phone?: string;
}
