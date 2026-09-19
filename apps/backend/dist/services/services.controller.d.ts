import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAll(all?: string): unknown;
    findBySlug(slug: string): unknown;
    create(dto: CreateServiceDto): unknown;
    update(id: string, dto: UpdateServiceDto): unknown;
    toggleActive(id: string): unknown;
    remove(id: string): unknown;
}
