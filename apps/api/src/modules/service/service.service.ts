import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { QueryServiceDto } from './dto/query-service.dto'
import { ServiceStatus } from '@prisma/client'

@Injectable()
export class ServiceCaseService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, query: QueryServiceDto) {
    return this.prisma.serviceCase.findMany({
      where: {
        organizationId,
        ...(query.clientId ? { clientId: query.clientId } : {}),
        ...(query.type ? { type: query.type } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(organizationId: string, id: string) {
    const serviceCase = await this.prisma.serviceCase.findFirst({
      where: { id, organizationId },
      include: { client: true },
    })
    if (!serviceCase) throw new NotFoundException(`ServiceCase ${id} not found`)
    return serviceCase
  }

  async create(organizationId: string, dto: CreateServiceDto) {
    return this.prisma.serviceCase.create({
      data: {
        clientId: dto.clientId,
        type: dto.type,
        description: dto.description,
        assignee: dto.assignee,
        organizationId,
      },
      include: { client: true },
    })
  }

  async update(organizationId: string, id: string, dto: UpdateServiceDto) {
    await this.findOne(organizationId, id)

    return this.prisma.serviceCase.update({
      where: { id },
      data: {
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.assignee !== undefined ? { assignee: dto.assignee } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.status === ServiceStatus.RESOLVED ? { resolvedAt: new Date() } : {}),
      },
      include: { client: true },
    })
  }

  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id)
    return this.prisma.serviceCase.delete({ where: { id } })
  }
}
