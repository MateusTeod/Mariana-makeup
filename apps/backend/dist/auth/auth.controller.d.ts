import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(dto: RegisterDto, res: Response): unknown;
    login(dto: LoginDto, res: Response): unknown;
    refresh(req: Request, res: Response, dto?: RefreshDto): unknown;
    logout(res: Response): unknown;
    private setRefreshCookie;
}
