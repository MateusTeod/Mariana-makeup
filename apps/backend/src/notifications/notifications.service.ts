import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async sendAppointmentConfirmation(appointment: any) {
    this.logger.log(
      `Sending confirmation for appointment ${appointment.id} to ${appointment.customer.email}`,
    );

    // Log notification in database (payload omitted for simplicity)
    await this.prisma.notification.create({
      data: {
        appointmentId: appointment.id,
        userId: appointment.customerId,
        type: 'APPOINTMENT_CONFIRMED',
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    this.logger.log(`Confirmation logged for appointment ${appointment.id}`);
  }

  async sendCancellationNotice(appointment: any) {
    this.logger.log(
      `Sending cancellation notice for appointment ${appointment.id}`,
    );

    await this.prisma.notification.create({
      data: {
        appointmentId: appointment.id,
        userId: appointment.customerId,
        type: 'APPOINTMENT_CANCELLED',
        status: 'SENT',
        sentAt: new Date(),
      },
    });
  }

  async sendReminder(appointmentId: string, reminderType: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { service: true, customer: true },
    });

    if (!appointment || appointment.status === 'CANCELLED') {
      return;
    }

    this.logger.log(
      `Sending ${reminderType} reminder for appointment ${appointmentId}`,
    );

    await this.prisma.notification.create({
      data: {
        appointmentId,
        userId: appointment.customerId,
        type: `REMINDER_${reminderType}`,
        status: 'SENT',
        sentAt: new Date(),
      },
    });
  }
}
