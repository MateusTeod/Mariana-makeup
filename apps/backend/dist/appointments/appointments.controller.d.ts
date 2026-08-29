import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(dto: CreateAppointmentDto, req: any): Promise<{
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
    findMyAppointments(req: any): Promise<({
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
    findMyUpcoming(req: any): Promise<({
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
    findMyHistory(req: any): Promise<({
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
    findById(id: string, req: any): Promise<{
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
    cancel(id: string, req: any): Promise<{
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
    updateStatus(id: string, status: any): Promise<{
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
