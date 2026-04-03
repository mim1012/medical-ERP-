import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateShippingDto } from './dto/create-shipping.dto'
import { UpdateShippingDto } from './dto/update-shipping.dto'
import { QueryShippingDto } from './dto/query-shipping.dto'
import { ShipmentStatus } from '@prisma/client'

@Injectable()
export class ShippingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, query: QueryShippingDto) {
    return this.prisma.shipment.findMany({
      where: {
        organizationId,
        ...(query.clientId ? { clientId: query.clientId } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      include: { items: { include: { product: true } }, client: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(organizationId: string, id: string) {
    const shipment = await this.prisma.shipment.findFirst({
      where: { id, organizationId },
      include: { items: { include: { product: true } }, client: true },
    })
    if (!shipment) throw new NotFoundException(`Shipment ${id} not found`)
    return shipment
  }

  async create(organizationId: string, dto: CreateShippingDto) {
    return this.prisma.shipment.create({
      data: {
        clientId: dto.clientId,
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
      include: { items: { include: { product: true } }, client: true },
    })
  }

  async updateStatus(organizationId: string, id: string, dto: UpdateShippingDto) {
    const shipment = await this.findOne(organizationId, id)

    if (dto.status === ShipmentStatus.SHIPPED) {
      const items = await this.prisma.shipmentItem.findMany({
        where: { shipmentId: id },
      })

      for (const item of items) {
        const inventory = await this.prisma.inventory.findUnique({
          where: { productId: item.productId },
        })
        if (!inventory || inventory.quantity < item.quantity) {
          throw new BadRequestException(
            `재고 부족: productId ${item.productId} (보유: ${inventory?.quantity ?? 0}, 필요: ${item.quantity})`,
          )
        }
      }

      await this.prisma.$transaction([
        this.prisma.shipment.update({
          where: { id },
          data: {
            status: ShipmentStatus.SHIPPED,
            shippedAt: new Date(),
            ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
          },
        }),
        ...items.map((item: { productId: string; quantity: number }) =>
          this.prisma.inventory.update({
            where: { productId: item.productId },
            data: { quantity: { decrement: item.quantity } },
          }),
        ),
      ])

      return this.findOne(organizationId, id)
    }

    if (dto.status === ShipmentStatus.DELIVERED) {
      return this.prisma.shipment.update({
        where: { id },
        data: {
          status: ShipmentStatus.DELIVERED,
          deliveredAt: new Date(),
          ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
        },
        include: { items: { include: { product: true } }, client: true },
      })
    }

    return this.prisma.shipment.update({
      where: { id },
      data: {
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
      include: { items: { include: { product: true } }, client: true },
    })
  }

  async remove(organizationId: string, id: string) {
    const shipment = await this.findOne(organizationId, id)
    if (shipment.status !== ShipmentStatus.REQUESTED) {
      throw new BadRequestException('REQUESTED 상태의 출고만 삭제할 수 있습니다')
    }
    await this.prisma.shipmentItem.deleteMany({ where: { shipmentId: id } })
    return this.prisma.shipment.delete({ where: { id } })
  }
}
