import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAll(all?: string): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    create(dto: CreateServiceDto): Promise<any>;
    update(id: string, dto: UpdateServiceDto): Promise<any>;
    toggleActive(id: string): Promise<any>;
    remove(id: string): Promise<any>;
}
