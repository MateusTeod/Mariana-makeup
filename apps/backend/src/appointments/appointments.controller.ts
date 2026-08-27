import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() dto: CreateAppointmentDto, @Request() req: any) {
    const userId = req.user?.id;
    return this.appointmentsService.create(dto, userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyAppointments(@Request() req: any) {
    return this.appointmentsService.findByUser(req.user.id);
  }

  @Get('me/upcoming')
  @UseGuards(JwtAuthGuard)
  findMyUpcoming(@Request() req: any) {
    return this.appointmentsService.findUpcoming(req.user.id);
  }

  @Get('me/history')
  @UseGuards(JwtAuthGuard)
  findMyHistory(@Request() req: any) {
    return this.appointmentsService.findHistory(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: string) {
    return this.appointmentsService.findById(id);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.cancel(id, req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.appointmentsService.updateStatus(id, status);
  }
}
