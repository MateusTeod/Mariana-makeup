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
exports.AvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AvailabilityService = class AvailabilityService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAvailableSlots(serviceId, date) {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
        });
        if (!service || !service.active) {
            return [];
        }
        const requestedDate = new Date(date);
        const dayOfWeek = requestedDate.getDay();
        const availability = await this.prisma.availability.findFirst({
            where: {
                dayOfWeek,
                active: true,
            },
        });
        if (!availability) {
            return [];
        }
        const isBlocked = await this.prisma.blockedTime.findFirst({
            where: {
                startAt: { lte: requestedDate },
                endAt: { gte: requestedDate },
            },
        });
        if (isBlocked) {
            return [];
        }
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
        const slots = this.generateTimeSlots(availability.startTime, availability.endTime, service.duration, requestedDate, existingAppointments.map((a) => ({
            startAt: a.startAt,
            endAt: a.endAt,
        })));
        return slots;
    }
    async isSlotAvailable(startAt, endAt) {
        const overlapping = await this.prisma.appointment.findFirst({
            where: {
                status: { notIn: ['CANCELLED', 'NO_SHOW'] },
                AND: [{ startAt: { lt: endAt } }, { endAt: { gt: startAt } }],
            },
        });
        return !overlapping;
    }
    generateTimeSlots(startTime, endTime, durationMinutes, date, existingAppointments) {
        const slots = [];
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        const current = new Date(date);
        current.setHours(startHour, startMin, 0, 0);
        const end = new Date(date);
        end.setHours(endHour, endMin, 0, 0);
        const now = new Date();
        while (current.getTime() + durationMinutes * 60 * 1000 <= end.getTime()) {
            const slotEnd = new Date(current.getTime() + durationMinutes * 60 * 1000);
            if (current <= now) {
                current.setMinutes(current.getMinutes() + 30);
                continue;
            }
            const isOccupied = existingAppointments.some((appt) => current < new Date(appt.endAt) && slotEnd > new Date(appt.startAt));
            slots.push({
                time: current.toISOString(),
                available: !isOccupied,
            });
            current.setMinutes(current.getMinutes() + 30);
        }
        return slots;
    }
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AvailabilityService);
//# sourceMappingURL=availability.service.js.map