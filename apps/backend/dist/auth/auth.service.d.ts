import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            phone: any;
            role: any;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            phone: any;
            role: any;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            phone: any;
            role: any;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    private generateTokens;
}
