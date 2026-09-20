import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    sendAppointmentConfirmation(appointment: any): Promise<void>;
    sendCancellationNotice(appointment: any): Promise<void>;
    sendReminder(appointmentId: string, reminderType: string): Promise<void>;
}
