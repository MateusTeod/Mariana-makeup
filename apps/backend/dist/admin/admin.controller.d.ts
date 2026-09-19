import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): unknown;
    getCalendarIcs(): Promise<string>;
    getAgenda(startDate: string, endDate: string): unknown;
    getClients(): unknown;
    getClientDetails(id: string): unknown;
}
