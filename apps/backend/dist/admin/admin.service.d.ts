import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        todayAppointments: number;
        monthAppointments: number;
        completedThisMonth: number;
        cancelledThisMonth: number;
        monthRevenue: number;
        averageTicket: number;
        totalClients: number;
        recentAppointments: ({
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
        })[];
    }>;
    getAgenda(startDate: string, endDate: string): Promise<({
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
    })[]>;
    getClients(): Promise<({
        appointments: {
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
        }[];
        _count: {
            appointments: number;
        };
    } & {
        name: string | null;
        email: string;
        password: string | null;
        phone: string | null;
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getClientDetails(id: string): Promise<({
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            userId: string;
            preferences: string | null;
        } | null;
        appointments: ({
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
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
}
