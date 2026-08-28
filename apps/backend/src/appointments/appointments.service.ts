import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private availabilityService: AvailabilityService,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateAppointmentDto, userId?: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });

    if (!service || !service.active) {
      throw new BadRequestException('Service not found or inactive');
    }

    const startAt = new Date(dto.startAt);
    const endAt = new Date(startAt.getTime() + service.duration * 60 * 1000);

    // Validate slot availability
    const isAvailable = await this.availabilityService.isSlotAvailable(
      startAt,
      endAt,
    );

    if (!isAvailable) {
      throw new ConflictException('This time slot is no longer available');
    }

    // Create or find customer
    let customerId = userId;

    if (!customerId) {
      // Guest booking - create or find user by email
      let user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: dto.email,
            name: dto.name,
            phone: dto.phone,
            role: 'CLIENT',
          },
        });
      }

      customerId = user.id;
    }

    // Use transaction to prevent double booking
    const appointment = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Check for overlapping appointments within transaction
      const overlapping = await tx.appointment.findFirst({
        where: {
          status: {
            notIn: ['CANCELLED', 'NO_SHOW'],
          },
          AND: [
            { startAt: { lt: endAt } },
            { endAt: { gt: startAt } },
          ],
        },
      });

      if (overlapping) {
        throw new ConflictException(
          'This time slot was just booked by another client',
        );
      }

      return tx.appointment.create({
        data: {
          customerId,
          serviceId: dto.serviceId,
          startAt,
          endAt,
          price: service.price,
          notes: dto.notes,
          status: 'CONFIRMED',
        },
        include: {
          service: true,
          customer: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      });
    });

    // Send confirmation notification
    await this.notificationsService.sendAppointmentConfirmation(appointment);

    return appointment;
  }

  async findByUser(userId: string) {
    return this.prisma.appointment.findMany({
      where: { customerId: userId },
      include: { service: true },
      orderBy: { startAt: 'asc' },
    });
  }

  async findUpcoming(userId: string) {
    return this.prisma.appointment.findMany({
      where: {
        customerId: userId,
        startAt: { gte: new Date() },
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      },
      include: { service: true },
      orderBy: { startAt: 'asc' },
      take: 5,
    });
  }

  async findHistory(userId: string) {
    return this.prisma.appointment.findMany({
      where: {
        customerId: userId,
        startAt: { lt: new Date() },
      },
      include: { service: true },
      orderBy: { startAt: 'desc' },
    });
  }

  async findById(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        service: true,
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async cancel(id: string, userId: string) {
    const appointment = await this.findById(id);

    if (appointment.customerId !== userId) {
      throw new ForbiddenException('You can only cancel your own appointments');
    }

    if (['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(appointment.status)) {
      throw new BadRequestException('Cannot cancel this appointment');
    }

    // Check cancellation policy (24 hours before)
    const hoursUntilAppointment =
      (appointment.startAt.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 24) {
      throw new BadRequestException(
        'Cancellations must be made at least 24 hours in advance',
      );
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { service: true, customer: true },
    });

    await this.notificationsService.sendCancellationNotice(updated);

    return updated;
  }

  async updateStatus(
    id: string,
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
  ) {
    const appointment = await this.findById(id);

    return this.prisma.appointment.update({
      where: { id },
      data: { status },
      include: { service: true, customer: true },
    });
  }
}
