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
            customer: {
                id: string;
                email: string;
                name: string | null;
                phone: string | null;
            };
            service: {
                id: string;
                price: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                description: string | null;
                duration: number;
                image: string | null;
                active: boolean;
            };
        } & {
            status: string;
            id: string;
            customerId: string;
            serviceId: string;
            startAt: Date;
            endAt: Date;
            price: number;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        allAppointments: ({
            customer: {
                id: string;
                email: string;
                name: string | null;
                phone: string | null;
            };
            service: {
                id: string;
                price: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                description: string | null;
                duration: number;
                image: string | null;
                active: boolean;
            };
        } & {
            status: string;
            id: string;
            customerId: string;
            serviceId: string;
            startAt: Date;
            endAt: Date;
            price: number;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    getCalendarIcs(): Promise<string>;
    getAgenda(startDate?: string, endDate?: string): Promise<({
        customer: {
            id: string;
            email: string;
            name: string | null;
            phone: string | null;
        };
        service: {
            id: string;
            price: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            duration: number;
            image: string | null;
            active: boolean;
        };
    } & {
        status: string;
        id: string;
        customerId: string;
        serviceId: string;
        startAt: Date;
        endAt: Date;
        price: number;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
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
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            preferences: string | null;
        } | null;
        appointments: ({
            service: {
                id: string;
                price: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                description: string | null;
                duration: number;
                image: string | null;
                active: boolean;
            };
        } & {
            status: string;
            id: string;
            customerId: string;
            serviceId: string;
            startAt: Date;
            endAt: Date;
            price: number;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        _count: {
            appointments: number;
        };
    } & {
        role: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string | null;
        name: string | null;
        phone: string | null;
    }) | null>;
}
