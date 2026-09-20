import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(activeOnly?: boolean): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    findById(id: string): Promise<any>;
    create(dto: CreateServiceDto): Promise<any>;
    update(id: string, dto: UpdateServiceDto): Promise<any>;
    toggleActive(id: string): Promise<any>;
    remove(id: string): Promise<any>;
    private generateSlug;
}
