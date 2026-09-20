import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        todayAppointments: any;
        upcomingAppointments: any;
        monthAppointments: any;
        completedThisMonth: any;
        cancelledThisMonth: any;
        monthRevenue: any;
        averageTicket: number;
        newClientsThisMonth: any;
        totalClients: any;
        recentAppointments: any;
        allAppointments: any;
    }>;
    getCalendarIcs(): Promise<string>;
    getAgenda(startDate?: string, endDate?: string): Promise<any>;
    getClients(): Promise<any>;
    getClientDetails(id: string): Promise<any>;
}
