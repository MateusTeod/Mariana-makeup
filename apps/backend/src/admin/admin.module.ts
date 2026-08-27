import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AppointmentsModule } from '../appointments/appointments.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [AppointmentsModule, ServicesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
