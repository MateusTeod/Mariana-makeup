import { UpdateMeDto } from './dto/update-me.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateMe(req: {
        user: {
            id: string;
        };
    }, dto: UpdateMeDto): Promise<{
        name: string | null;
        email: string;
        phone: string | null;
        id: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
