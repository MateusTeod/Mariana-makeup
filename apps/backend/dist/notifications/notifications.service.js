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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async sendAppointmentConfirmation(appointment) {
        this.logger.log(`Sending confirmation for appointment ${appointment.id} to ${appointment.customer.email}`);
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
    async sendCancellationNotice(appointment) {
        this.logger.log(`Sending cancellation notice for appointment ${appointment.id}`);
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
    async sendReminder(appointmentId, reminderType) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { service: true, customer: true },
        });
        if (!appointment || appointment.status === 'CANCELLED') {
            return;
        }
        this.logger.log(`Sending ${reminderType} reminder for appointment ${appointmentId}`);
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
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map