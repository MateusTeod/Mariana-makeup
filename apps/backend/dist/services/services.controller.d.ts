import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAll(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        duration: number;
        image: string | null;
        active: boolean;
        slug: string;
    }[]>;
    findBySlug(slug: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        duration: number;
        image: string | null;
        active: boolean;
        slug: string;
    }>;
    create(dto: CreateServiceDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        duration: number;
        image: string | null;
        active: boolean;
        slug: string;
    }>;
    update(id: string, dto: UpdateServiceDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        duration: number;
        image: string | null;
        active: boolean;
        slug: string;
    }>;
    toggleActive(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        duration: number;
        image: string | null;
        active: boolean;
        slug: string;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        price: number;
        duration: number;
        image: string | null;
        active: boolean;
        slug: string;
    }>;
}
