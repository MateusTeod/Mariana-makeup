import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsService {
    private prisma;
    private availabilityService;
    private notificationsService;
    constructor(prisma: PrismaService, availabilityService: AvailabilityService, notificationsService: NotificationsService);
    create(dto: CreateAppointmentDto, userId?: string): Promise<{
        service: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number;
            duration: number;
            image: string | null;
            active: boolean;
            slug: string;
        };
        customer: {
            name: string | null;
            email: string;
            phone: string | null;
            id: string;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        startAt: Date;
        endAt: Date;
        customerId: string;
        serviceId: string;
        notes: string | null;
    }>;
    findByUser(userId: string): Promise<({
        service: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number;
            duration: number;
            image: string | null;
            active: boolean;
            slug: string;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        startAt: Date;
        endAt: Date;
        customerId: string;
        serviceId: string;
        notes: string | null;
    })[]>;
    findUpcoming(userId: string): Promise<({
        service: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number;
            duration: number;
            image: string | null;
            active: boolean;
            slug: string;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        startAt: Date;
        endAt: Date;
        customerId: string;
        serviceId: string;
        notes: string | null;
    })[]>;
    findHistory(userId: string): Promise<({
        service: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number;
            duration: number;
            image: string | null;
            active: boolean;
            slug: string;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        startAt: Date;
        endAt: Date;
        customerId: string;
        serviceId: string;
        notes: string | null;
    })[]>;
    findById(id: string, userId?: string): Promise<{
        service: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number;
            duration: number;
            image: string | null;
            active: boolean;
            slug: string;
        };
        customer: {
            name: string | null;
            email: string;
            phone: string | null;
            id: string;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        startAt: Date;
        endAt: Date;
        customerId: string;
        serviceId: string;
        notes: string | null;
    }>;
    cancel(id: string, userId: string): Promise<{
        service: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number;
            duration: number;
            image: string | null;
            active: boolean;
            slug: string;
        };
        customer: {
            name: string | null;
            email: string;
            password: string | null;
            phone: string | null;
            id: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        startAt: Date;
        endAt: Date;
        customerId: string;
        serviceId: string;
        notes: string | null;
    }>;
    updateStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'): Promise<{
        service: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: number;
            duration: number;
            image: string | null;
            active: boolean;
            slug: string;
        };
        customer: {
            name: string | null;
            email: string;
            password: string | null;
            phone: string | null;
            id: string;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        startAt: Date;
        endAt: Date;
        customerId: string;
        serviceId: string;
        notes: string | null;
    }>;
}
