"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = AdminService_1 = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AdminService_1.name);
    }
    async getDashboard() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const now = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        const dashboardQueriesPromise = (async () => [
            await this.prisma.appointment.count({
                where: {
                    startAt: { gte: today, lt: tomorrow },
                    status: { notIn: ['CANCELLED', 'NO_SHOW'] },
                },
            }),
            await this.prisma.appointment.count({
                where: {
                    startAt: { gte: now },
                    status: { notIn: ['CANCELLED', 'NO_SHOW'] },
                },
            }),
            await this.prisma.appointment.count({
                where: {
                    startAt: { gte: monthStart, lte: monthEnd },
                    status: { notIn: ['CANCELLED', 'NO_SHOW'] },
                },
            }),
            await this.prisma.appointment.count({
                where: {
                    startAt: { gte: monthStart, lte: monthEnd },
                    status: 'COMPLETED',
                },
            }),
            await this.prisma.appointment.count({
                where: {
                    startAt: { gte: monthStart, lte: monthEnd },
                    status: 'CANCELLED',
                },
            }),
            await this.prisma.user.count({
                where: {
                    role: 'CLIENT',
                    createdAt: { gte: monthStart, lte: monthEnd },
                },
            }),
            await this.prisma.user.count({ where: { role: 'CLIENT' } }),
            await this.prisma.appointment.findMany({
                include: {
                    service: true,
                    customer: {
                        select: { id: true, name: true, email: true, phone: true },
                    },
                },
                orderBy: { startAt: 'asc' },
            }),
        ])();
        let dashboardQueries;
        try {
            dashboardQueries = await dashboardQueriesPromise;
        }
        catch (error) {
            this.logger.error('Failed to load admin dashboard', error instanceof Error ? error.stack : String(error));
            throw error;
        }
        const [todayAppointments, upcomingAppointments, monthAppointments, completedThisMonth, cancelledThisMonth, newClientsThisMonth, totalClients, allAppointments,] = dashboardQueries;
        const monthAppointmentsList = allAppointments.filter((a) => new Date(a.startAt) >= monthStart &&
            new Date(a.startAt) <= monthEnd &&
            !['CANCELLED', 'NO_SHOW'].includes(a.status));
        const monthRevenue = monthAppointmentsList
            .filter((a) => ['PAID', 'COMPLETED', 'CONFIRMED'].includes(a.status))
            .reduce((sum, a) => sum + Number(a.price), 0);
        const paidOrCompletedCount = monthAppointmentsList.filter((a) => ['PAID', 'COMPLETED'].includes(a.status)).length;
        const averageTicket = paidOrCompletedCount > 0
            ? Math.round(monthRevenue / paidOrCompletedCount)
            : monthAppointmentsList.length > 0
                ? Math.round(monthRevenue / monthAppointmentsList.length)
                : 0;
        return {
            todayAppointments,
            upcomingAppointments,
            monthAppointments,
            completedThisMonth,
            cancelledThisMonth,
            monthRevenue,
            averageTicket,
            newClientsThisMonth,
            totalClients,
            recentAppointments: allAppointments.slice(0, 10),
            allAppointments,
        };
    }
    async getCalendarIcs() {
        const appointments = await this.prisma.appointment.findMany({
            where: {
                status: { notIn: ['CANCELLED', 'NO_SHOW'] },
            },
            include: {
                service: true,
                customer: true,
            },
            orderBy: { startAt: 'asc' },
        });
        const formatIcsDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        const escapeIcs = (str) => {
            return (str || '')
                .replace(/\\/g, '\\\\')
                .replace(/;/g, '\\;')
                .replace(/,/g, '\\,')
                .replace(/\n/g, '\\n');
        };
        const events = appointments.map((apt) => {
            const clientName = apt.customer?.name || 'Cliente';
            const clientPhone = apt.customer?.phone || 'Não informado';
            const serviceName = apt.service?.name || 'Maquiagem';
            const description = `Serviço: ${serviceName}\nCliente: ${clientName}\nTelefone: ${clientPhone}\nValor: R$ ${apt.price}\nStatus: ${apt.status}${apt.notes ? `\nNotas: ${apt.notes}` : ''}`;
            return [
                'BEGIN:VEVENT',
                `UID:mariana-apt-${apt.id}@marianaaparicio.com`,
                `DTSTAMP:${formatIcsDate(new Date())}`,
                `DTSTART:${formatIcsDate(new Date(apt.startAt))}`,
                `DTEND:${formatIcsDate(new Date(apt.endAt))}`,
                `SUMMARY:${escapeIcs(`Maquiagem: ${serviceName} - ${clientName}`)}`,
                `DESCRIPTION:${escapeIcs(description)}`,
                'LOCATION:Estúdio Mariana Aparicio',
                'STATUS:CONFIRMED',
                'END:VEVENT',
            ].join('\r\n');
        });
        return [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Mariana Aparicio//Agenda Profissional//PT',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'X-WR-CALNAME:Agenda Mariana Aparicio',
            'X-WR-TIMEZONE:America/Sao_Paulo',
            ...events,
            'END:VCALENDAR',
        ].join('\r\n');
    }
    async getAgenda(startDate, endDate) {
        const where = {};
        if (startDate && endDate) {
            where.startAt = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        else if (startDate) {
            where.startAt = { gte: new Date(startDate) };
        }
        else if (endDate) {
            where.startAt = { lte: new Date(endDate) };
        }
        return this.prisma.appointment.findMany({
            where,
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
        const clients = await this.prisma.user.findMany({
            where: { role: 'CLIENT' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                appointments: {
                    select: { startAt: true, price: true, status: true },
                    orderBy: { startAt: 'desc' },
                },
                _count: {
                    select: { appointments: true },
                },
            },
        });
        return clients.map((client) => {
            const completedAppointments = client.appointments.filter((a) => !['CANCELLED', 'NO_SHOW'].includes(a.status));
            const totalSpent = completedAppointments.reduce((sum, a) => sum + Number(a.price), 0);
            const lastAppointment = completedAppointments.length > 0
                ? completedAppointments[0].startAt
                : null;
            return {
                id: client.id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                createdAt: client.createdAt,
                totalAppointments: client._count.appointments,
                totalSpent,
                lastAppointment,
            };
        });
    }
    async getClientDetails(id) {
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = AdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map