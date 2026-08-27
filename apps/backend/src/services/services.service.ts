import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly = true) {
    return this.prisma.service.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const service = await this.prisma.service.findUnique({
      where: { slug },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async findById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async create(dto: CreateServiceDto) {
    const slug = this.generateSlug(dto.name);

    return this.prisma.service.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        price: dto.price,
        duration: dto.duration,
        image: dto.image,
      },
    });
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findById(id);

    return this.prisma.service.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.name ? { slug: this.generateSlug(dto.name) } : {}),
      },
    });
  }

  async toggleActive(id: string) {
    const service = await this.findById(id);

    return this.prisma.service.update({
      where: { id },
      data: { active: !service.active },
    });
  }

  async remove(id: string) {
    await this.findById(id);

    return this.prisma.service.delete({
      where: { id },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
