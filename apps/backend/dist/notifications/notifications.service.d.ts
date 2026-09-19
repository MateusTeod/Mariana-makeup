import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    sendAppointmentConfirmation(appointment: any): any;
    sendCancellationNotice(appointment: any): any;
    sendReminder(appointmentId: string, reminderType: string): any;
}
