import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateSettlementDto } from './dto/create-settlement.dto'
import { UpdateSettlementDto } from './dto/update-settlement.dto'
import { QuerySettlementDto } from './dto/query-settlement.dto'

// Models will be added via migration
@Injectable()
export class SettlementService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, query: QuerySettlementDto) {
    const { clientId, status, type } = query
    return this.prisma.settlement.findMany({
      where: {
        organizationId,
        ...(clientId && { clientId }),
        ...(status && { status }),
        ...(type && { type }),
      },
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(organizationId: string, id: string) {
    const settlement = await this.prisma.settlement.findFirst({
      where: { id, organizationId },
      include: { client: true },
    })
    if (!settlement) throw new NotFoundException(`Settlement ${id} not found`)
    return settlement
  }

  async create(organizationId: string, dto: CreateSettlementDto) {
    return this.prisma.settlement.create({
      data: {
        ...dto,
        amount: dto.amount,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        organizationId,
      },
      include: { client: true },
    })
  }

  async update(organizationId: string, id: string, dto: UpdateSettlementDto) {
    await this.findOne(organizationId, id)
    return this.prisma.settlement.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        settledAt: dto.settledAt ? new Date(dto.settledAt) : undefined,
      },
      include: { client: true },
    })
  }

  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id)
    return this.prisma.settlement.delete({ where: { id } })
  }
}
