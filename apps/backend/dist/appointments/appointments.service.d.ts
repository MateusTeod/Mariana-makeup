import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsService {
    private prisma;
    private availabilityService;
    private notificationsService;
    constructor(prisma: PrismaService, availabilityService: AvailabilityService, notificationsService: NotificationsService);
    create(dto: CreateAppointmentDto, userId?: string): unknown;
    findByUser(userId: string): unknown;
    findUpcoming(userId: string): unknown;
    findHistory(userId: string): unknown;
    findAll(): unknown;
    findById(id: string, userId?: string): unknown;
    cancel(id: string, userId: string): unknown;
    updateStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'): unknown;
}
