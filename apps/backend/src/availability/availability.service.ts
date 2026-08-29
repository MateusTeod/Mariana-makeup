import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async getAvailableSlots(serviceId: string, date: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || !service.active) {
      return [];
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();

    // Get working hours for this day
    const availability = await this.prisma.availability.findFirst({
      where: {
        dayOfWeek,
        active: true,
      },
    });

    if (!availability) {
      return []; // Day off
    }

    // Check if date is blocked
    const isBlocked = await this.prisma.blockedTime.findFirst({
      where: {
        startAt: { lte: requestedDate },
        endAt: { gte: requestedDate },
      },
    });

    if (isBlocked) {
      return [];
    }

    // Get existing appointments for the date
    const dayStart = new Date(requestedDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(requestedDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        startAt: { gte: dayStart },
        endAt: { lte: dayEnd },
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      },
    });

    // Generate slots
    const slots = this.generateTimeSlots(
      availability.startTime,
      availability.endTime,
      service.duration,
      requestedDate,
      existingAppointments.map((a: any) => ({
        startAt: a.startAt,
        endAt: a.endAt,
      })),
    );

    return slots;
  }

  async isSlotAvailable(startAt: Date, endAt: Date): Promise<boolean> {
    const overlapping = await this.prisma.appointment.findFirst({
      where: {
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        AND: [{ startAt: { lt: endAt } }, { endAt: { gt: startAt } }],
      },
    });

    return !overlapping;
  }

  private generateTimeSlots(
    startTime: string,
    endTime: string,
    durationMinutes: number,
    date: Date,
    existingAppointments: { startAt: Date; endAt: Date }[],
  ) {
    const slots: { time: string; available: boolean }[] = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const current = new Date(date);
    current.setHours(startHour, startMin, 0, 0);

    const end = new Date(date);
    end.setHours(endHour, endMin, 0, 0);

    const now = new Date();

    while (current.getTime() + durationMinutes * 60 * 1000 <= end.getTime()) {
      const slotEnd = new Date(current.getTime() + durationMinutes * 60 * 1000);

      // Skip past slots
      if (current <= now) {
        current.setMinutes(current.getMinutes() + 30);
        continue;
      }

      const isOccupied = existingAppointments.some(
        (appt) =>
          current < new Date(appt.endAt) && slotEnd > new Date(appt.startAt),
      );

      // Format time as HH:mm
      const hours = String(current.getHours()).padStart(2, '0');
      const minutes = String(current.getMinutes()).padStart(2, '0');
      const timeString = `${hours}:${minutes}`;

      slots.push({
        time: timeString,
        available: !isOccupied,
      });

      current.setMinutes(current.getMinutes() + 30); // 30-min intervals
    }

    return slots;
  }
}
