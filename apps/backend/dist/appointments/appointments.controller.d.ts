import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(dto: CreateAppointmentDto, req: any): Promise<any>;
    findMyAppointments(req: any): Promise<any>;
    findMyUpcoming(req: any): Promise<any>;
    findMyHistory(req: any): Promise<any>;
    findAll(): Promise<any>;
    findById(id: string, req: any): Promise<any>;
    cancel(id: string, req: any): Promise<any>;
    updateStatus(id: string, status: any): Promise<any>;
}
