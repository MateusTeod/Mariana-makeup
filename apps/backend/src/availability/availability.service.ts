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

    // Parse date parts safely to avoid UTC midnight shifting backwards in UTC-3
    const dateString = date.split('T')[0];
    const [year, month, day] = dateString.split('-').map(Number);
    const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

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

    const dayStart = new Date(`${dateString}T00:00:00-03:00`);
    const dayEnd = new Date(`${dateString}T23:59:59.999-03:00`);

    // Check if date is blocked
    const isBlocked = await this.prisma.blockedTime.findFirst({
      where: {
        startAt: { lte: dayEnd },
        endAt: { gte: dayStart },
      },
    });

    if (isBlocked) {
      return [];
    }

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
      dateString,
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
    date: string,
    existingAppointments: { startAt: Date; endAt: Date }[],
  ) {
    const slots: { time: string; available: boolean }[] = [];
    const current = new Date(`${date}T${startTime}:00-03:00`);
    const end = new Date(`${date}T${endTime}:00-03:00`);

    const now = new Date();

    while (current.getTime() + durationMinutes * 60 * 1000 <= end.getTime()) {
      const slotEnd = new Date(current.getTime() + durationMinutes * 60 * 1000);

      // Skip past slots
      if (current <= now) {
        current.setUTCMinutes(current.getUTCMinutes() + 30);
        continue;
      }

      const isOccupied = existingAppointments.some(
        (appt) =>
          current < new Date(appt.endAt) && slotEnd > new Date(appt.startAt),
      );

      // Format time as HH:mm
      const timeString = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).format(current);

      slots.push({
        time: timeString,
        available: !isOccupied,
      });

      current.setUTCMinutes(current.getUTCMinutes() + 30); // 30-min intervals
    }

    return slots;
  }
}
