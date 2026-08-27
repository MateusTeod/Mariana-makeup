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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const availability_service_1 = require("../availability/availability.service");
const notifications_service_1 = require("../notifications/notifications.service");
let AppointmentsService = class AppointmentsService {
    constructor(prisma, availabilityService, notificationsService) {
        this.prisma = prisma;
        this.availabilityService = availabilityService;
        this.notificationsService = notificationsService;
    }
    async create(dto, userId) {
        const service = await this.prisma.service.findUnique({
            where: { id: dto.serviceId },
        });
        if (!service || !service.active) {
            throw new common_1.BadRequestException('Service not found or inactive');
        }
        const startAt = new Date(dto.startAt);
        const endAt = new Date(startAt.getTime() + service.duration * 60 * 1000);
        const isAvailable = await this.availabilityService.isSlotAvailable(startAt, endAt);
        if (!isAvailable) {
            throw new common_1.ConflictException('This time slot is no longer available');
        }
        let customerId = userId;
        if (!customerId) {
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
        const appointment = await this.prisma.$transaction(async (tx) => {
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
                throw new common_1.ConflictException('This time slot was just booked by another client');
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
        await this.notificationsService.sendAppointmentConfirmation(appointment);
        return appointment;
    }
    async findByUser(userId) {
        return this.prisma.appointment.findMany({
            where: { customerId: userId },
            include: { service: true },
            orderBy: { startAt: 'asc' },
        });
    }
    async findUpcoming(userId) {
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
    async findHistory(userId) {
        return this.prisma.appointment.findMany({
            where: {
                customerId: userId,
                startAt: { lt: new Date() },
            },
            include: { service: true },
            orderBy: { startAt: 'desc' },
        });
    }
    async findById(id) {
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
            throw new common_1.NotFoundException('Appointment not found');
        }
        return appointment;
    }
    async cancel(id, userId) {
        const appointment = await this.findById(id);
        if (appointment.customerId !== userId) {
            throw new common_1.ForbiddenException('You can only cancel your own appointments');
        }
        if (['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(appointment.status)) {
            throw new common_1.BadRequestException('Cannot cancel this appointment');
        }
        const hoursUntilAppointment = (appointment.startAt.getTime() - Date.now()) / (1000 * 60 * 60);
        if (hoursUntilAppointment < 24) {
            throw new common_1.BadRequestException('Cancellations must be made at least 24 hours in advance');
        }
        const updated = await this.prisma.appointment.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: { service: true, customer: true },
        });
        await this.notificationsService.sendCancellationNotice(updated);
        return updated;
    }
    async updateStatus(id, status) {
        const appointment = await this.findById(id);
        return this.prisma.appointment.update({
            where: { id },
            data: { status },
            include: { service: true, customer: true },
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        availability_service_1.AvailabilityService,
        notifications_service_1.NotificationsService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map