import { PrismaService } from '../prisma/prisma.service';
import { UpdateMeDto } from './dto/update-me.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    updateMe(userId: string, dto: UpdateMeDto): Promise<{
        name: string | null;
        email: string;
        phone: string | null;
        id: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
