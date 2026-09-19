import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(): unknown;
    getCalendarIcs(): Promise<string>;
    getAgenda(startDate?: string, endDate?: string): unknown;
    getClients(): unknown;
    getClientDetails(id: string): unknown;
}
