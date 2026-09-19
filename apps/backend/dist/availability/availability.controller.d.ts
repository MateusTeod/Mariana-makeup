import { AvailabilityService } from './availability.service';
export declare class AvailabilityController {
    private readonly availabilityService;
    constructor(availabilityService: AvailabilityService);
    getAvailableSlots(serviceId: string, date: string): unknown;
}
