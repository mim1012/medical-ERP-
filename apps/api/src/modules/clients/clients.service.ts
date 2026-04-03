import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { QueryClientDto } from './dto/query-client.dto'

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, query: QueryClientDto) {
    const { name, type, page = 1, limit = 20 } = query
    const skip = (page - 1) * limit

    const where = {
      organizationId,
      ...(name && { name: { contains: name, mode: 'insensitive' as const } }),
      ...(type && { type }),
    }

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.client.count({ where }),
    ])

    return { data, meta: { total, page, limit } }
  }

  async findOne(id: string, organizationId: string) {
    const client = await this.prisma.client.findFirst({ where: { id, organizationId } })
    if (!client) throw new NotFoundException(`Client ${id} not found`)
    return client
  }

  async create(organizationId: string, dto: CreateClientDto) {
    return this.prisma.client.create({ data: { ...dto, organizationId } })
  }

  async update(id: string, organizationId: string, dto: UpdateClientDto) {
    await this.findOne(id, organizationId)
    return this.prisma.client.update({ where: { id }, data: dto })
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId)
    return this.prisma.client.delete({ where: { id } })
  }
}
