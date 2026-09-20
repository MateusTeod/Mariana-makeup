import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    getAgenda(startDate: string, endDate: string): Promise<any>;
    getClients(): Promise<any>;
    getClientDetails(id: string): Promise<any>;
}
