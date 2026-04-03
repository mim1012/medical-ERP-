import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateReceivingDto } from './dto/create-receiving.dto'
import { UpdateReceivingDto } from './dto/update-receiving.dto'
import { QueryReceivingDto } from './dto/query-receiving.dto'
import { ReceivingStatus } from '@prisma/client'

@Injectable()
export class ReceivingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, query: QueryReceivingDto) {
    return this.prisma.receiving.findMany({
      where: {
        organizationId,
        ...(query.supplier ? { supplier: { contains: query.supplier, mode: 'insensitive' } } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(organizationId: string, id: string) {
    const receiving = await this.prisma.receiving.findFirst({
      where: { id, organizationId },
      include: { items: { include: { product: true } } },
    })
    if (!receiving) throw new NotFoundException(`Receiving ${id} not found`)
    return receiving
  }

  async create(organizationId: string, dto: CreateReceivingDto) {
    return this.prisma.receiving.create({
      data: {
        supplier: dto.supplier,
        notes: dto.notes,
        organizationId,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })
  }

  async update(organizationId: string, id: string, dto: UpdateReceivingDto) {
    await this.findOne(organizationId, id)

    if (dto.status === ReceivingStatus.COMPLETED) {
      const receiving = await this.prisma.receiving.findFirst({
        where: { id, organizationId },
        include: { items: true },
      })

      await this.prisma.$transaction([
        this.prisma.receiving.update({
          where: { id },
          data: { status: ReceivingStatus.COMPLETED, receivedAt: new Date(), notes: dto.notes },
        }),
        ...receiving!.items.map((item: { productId: string; quantity: number }) =>
          this.prisma.inventory.upsert({
            where: { productId: item.productId },
            update: { quantity: { increment: item.quantity } },
            create: {
              productId: item.productId,
              quantity: item.quantity,
              organizationId,
            },
          }),
        ),
      ])

      return this.findOne(organizationId, id)
    }

    return this.prisma.receiving.update({
      where: { id },
      data: {
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
      include: { items: { include: { product: true } } },
    })
  }

  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id)
    await this.prisma.receivingItem.deleteMany({ where: { receivingId: id } })
    return this.prisma.receiving.delete({ where: { id } })
  }
}
