import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateInventoryDto } from './dto/update-inventory.dto'

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string) {
    const data = await this.prisma.inventory.findMany({
      where: { organizationId },
      include: { product: true },
      orderBy: { updatedAt: 'desc' },
    })
    return { data, meta: { total: data.length, page: 1, limit: data.length } }
  }

  async findOne(id: string, organizationId: string) {
    const inventory = await this.prisma.inventory.findFirst({
      where: { id, organizationId },
      include: { product: true },
    })
    if (!inventory) throw new NotFoundException(`Inventory ${id} not found`)
    return inventory
  }

  async update(id: string, organizationId: string, dto: UpdateInventoryDto) {
    await this.findOne(id, organizationId)
    return this.prisma.inventory.update({ where: { id }, data: dto })
  }

  async adjust(id: string, organizationId: string, dto: { quantity: number }) {
    const inv = await this.findOne(id, organizationId)
    if (inv.quantity + dto.quantity < 0) {
      throw new BadRequestException('Resulting quantity cannot be negative')
    }
    return this.prisma.inventory.update({
      where: { id },
      data: { quantity: { increment: dto.quantity } },
      include: { product: true },
    })
  }
}
