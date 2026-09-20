import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsService {
    private prisma;
    private availabilityService;
    private notificationsService;
    constructor(prisma: PrismaService, availabilityService: AvailabilityService, notificationsService: NotificationsService);
    create(dto: CreateAppointmentDto, userId?: string): Promise<any>;
    findByUser(userId: string): Promise<any>;
    findUpcoming(userId: string): Promise<any>;
    findHistory(userId: string): Promise<any>;
    findAll(): Promise<any>;
    findById(id: string, userId?: string): Promise<any>;
    cancel(id: string, userId: string): Promise<any>;
    updateStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'): Promise<any>;
}
