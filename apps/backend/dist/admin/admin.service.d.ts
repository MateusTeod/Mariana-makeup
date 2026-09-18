import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        todayAppointments: number;
        upcomingAppointments: number;
        monthAppointments: number;
        completedThisMonth: number;
        cancelledThisMonth: number;
        monthRevenue: number;
        averageTicket: number;
        newClientsThisMonth: number;
        totalClients: number;
        recentAppointments: ({
            service: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
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
            status: import("@prisma/client").$Enums.AppointmentStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            serviceId: string;
            startAt: Date;
            endAt: Date;
            customerId: string;
            notes: string | null;
        })[];
        allAppointments: ({
            service: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
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
            status: import("@prisma/client").$Enums.AppointmentStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            serviceId: string;
            startAt: Date;
            endAt: Date;
            customerId: string;
            notes: string | null;
        })[];
    }>;
    getCalendarIcs(): Promise<string>;
    getAgenda(startDate?: string, endDate?: string): Promise<({
        service: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
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
        status: import("@prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: import("@prisma/client/runtime/library").Decimal;
        serviceId: string;
        startAt: Date;
        endAt: Date;
        customerId: string;
        notes: string | null;
    })[]>;
    getClients(): Promise<{
        id: string;
        name: string | null;
        email: string;
        phone: string | null;
        createdAt: Date;
        totalAppointments: number;
        totalSpent: number;
        lastAppointment: Date | null;
    }[]>;
    getClientDetails(id: string): Promise<({
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            userId: string;
            preferences: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
        appointments: ({
            service: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                duration: number;
                image: string | null;
                active: boolean;
                slug: string;
            };
        } & {
            status: import("@prisma/client").$Enums.AppointmentStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client/runtime/library").Decimal;
            serviceId: string;
            startAt: Date;
            endAt: Date;
            customerId: string;
            notes: string | null;
        })[];
        _count: {
            appointments: number;
        };
    } & {
        name: string | null;
        email: string;
        password: string | null;
        phone: string | null;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
}
