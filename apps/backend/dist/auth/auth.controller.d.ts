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
            id: string;
            email: string;
            name: string | null;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
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
