import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(dto: CreateAppointmentDto, req: any): unknown;
    findMyAppointments(req: any): unknown;
    findMyUpcoming(req: any): unknown;
    findMyHistory(req: any): unknown;
    findAll(): unknown;
    findById(id: string, req: any): unknown;
    cancel(id: string, req: any): unknown;
    updateStatus(id: string, status: any): unknown;
}
