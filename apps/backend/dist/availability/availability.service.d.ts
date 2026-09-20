import { PrismaService } from '../prisma/prisma.service';
export declare class AvailabilityService {
    private prisma;
    constructor(prisma: PrismaService);
    getAvailableSlots(serviceId: string, date: string): Promise<{
        time: string;
        available: boolean;
    }[]>;
    isSlotAvailable(startAt: Date, endAt: Date): Promise<boolean>;
    private generateTimeSlots;
}
