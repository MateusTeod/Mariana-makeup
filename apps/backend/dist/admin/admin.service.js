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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const [todayAppointments, monthAppointments, completedThisMonth, cancelledThisMonth, totalClients,] = await Promise.all([
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
            .filter((a) => ['PAID', 'COMPLETED'].includes(a.status))
            .reduce((sum, a) => sum + Number(a.price), 0);
        const averageTicket = completedThisMonth > 0 ? monthRevenue / completedThisMonth : 0;
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
    async getAgenda(startDate, endDate) {
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
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map