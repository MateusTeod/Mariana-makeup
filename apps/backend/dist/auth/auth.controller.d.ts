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
    register(dto: RegisterDto, res: Response): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            phone: any;
            role: any;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            phone: any;
            role: any;
        };
        accessToken: string;
    }>;
    refresh(req: Request, res: Response, dto?: RefreshDto): Promise<{
        accessToken: string;
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    private setRefreshCookie;
}
