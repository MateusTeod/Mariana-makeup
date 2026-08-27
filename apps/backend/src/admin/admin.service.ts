import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [
      todayAppointments,
      monthAppointments,
      completedThisMonth,
      cancelledThisMonth,
      totalClients,
    ] = await Promise.all([
      this.prisma.appointment.count({
        where: {
          startAt: { gte: today, lt: tomorrow },
          status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        },
      }),
      this.prisma.appointment.findMany({
        where: {
          startAt: { gte: monthStart, lte: monthEnd },
          status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        },
        include: { service: true, customer: true },
        orderBy: { startAt: 'asc' },
      }),
      this.prisma.appointment.count({
        where: {
          startAt: { gte: monthStart, lte: monthEnd },
          status: 'COMPLETED',
        },
      }),
      this.prisma.appointment.count({
        where: {
          startAt: { gte: monthStart, lte: monthEnd },
          status: 'CANCELLED',
        },
      }),
      this.prisma.user.count({ where: { role: 'CLIENT' } }),
    ]);

    const monthRevenue = monthAppointments
      .filter((a: any) => ['PAID', 'COMPLETED'].includes(a.status))
      .reduce((sum: number, a: any) => sum + Number(a.price), 0);

    const averageTicket =
      completedThisMonth > 0 ? monthRevenue / completedThisMonth : 0;

    return {
      todayAppointments,
      monthAppointments: monthAppointments.length,
      completedThisMonth,
      cancelledThisMonth,
      monthRevenue,
      averageTicket,
      totalClients,
      recentAppointments: monthAppointments.slice(0, 10),
    };
  }

  async getAgenda(startDate: string, endDate: string) {
    return this.prisma.appointment.findMany({
      where: {
        startAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        service: true,
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { startAt: 'asc' },
    });
  }

  async getClients() {
    return this.prisma.user.findMany({
      where: { role: 'CLIENT' },
      include: {
        appointments: {
          orderBy: { startAt: 'desc' },
          take: 1,
        },
        _count: {
          select: { appointments: true },
        },
      },
    });
  }

  async getClientDetails(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        appointments: {
          include: { service: true },
          orderBy: { startAt: 'desc' },
        },
        _count: {
          select: { appointments: true },
        },
      },
    });
  }
}
