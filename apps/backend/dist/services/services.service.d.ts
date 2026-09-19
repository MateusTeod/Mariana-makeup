import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(activeOnly?: boolean): unknown;
    findBySlug(slug: string): unknown;
    findById(id: string): unknown;
    create(dto: CreateServiceDto): unknown;
    update(id: string, dto: UpdateServiceDto): unknown;
    toggleActive(id: string): unknown;
    remove(id: string): unknown;
    private generateSlug;
}
