import { Controller, Get, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  getAvailableSlots(
    @Query('serviceId') serviceId: string,
    @Query('date') date: string,
  ) {
    return this.availabilityService.getAvailableSlots(serviceId, date);
  }
}
