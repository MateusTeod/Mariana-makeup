import { Controller, Get, Header, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('calendar/export.ics')
  @Header('Content-Type', 'text/calendar; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="agenda-mariana.ics"')
  getCalendarIcs() {
    return this.adminService.getCalendarIcs();
  }

  @Get('agenda')
  getAgenda(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.adminService.getAgenda(startDate, endDate);
  }

  @Get('clients')
  getClients() {
    return this.adminService.getClients();
  }

  @Get('clients/:id')
  getClientDetails(@Param('id') id: string) {
    return this.adminService.getClientDetails(id);
  }
}
