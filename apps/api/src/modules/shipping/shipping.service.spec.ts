import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { ShippingService } from './shipping.service'
import { PrismaService } from '../../prisma/prisma.service'
import { ShipmentStatus } from '@prisma/client'

describe('ShippingService', () => {
  let service: ShippingService
  let prisma: jest.Mocked<PrismaService>

  const mockShipment = {
    id: 's1',
    organizationId: 'org1',
    clientId: 'c1',
    status: ShipmentStatus.REQUESTED,
    notes: null,
    shippedAt: null,
    deliveredAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      { id: 'si1', shipmentId: 's1', productId: 'p1', quantity: 5, unitPrice: 10000, product: { id: 'p1', name: 'Product A' } },
    ],
    client: { id: 'c1', name: 'Client A' },
  }

  beforeEach(async () => {
    const mockPrisma = {
      shipment: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      shipmentItem: {
        findMany: jest.fn(),
        deleteMany: jest.fn(),
      },
      inventory: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShippingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile()

    service = module.get<ShippingService>(ShippingService)
    prisma = module.get(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('creates shipment with items', async () => {
      const dto = {
        clientId: 'c1',
        notes: 'note',
        items: [{ productId: 'p1', quantity: 5, unitPrice: 10000 }],
      }
      ;(prisma.shipment.create as jest.Mock).mockResolvedValue(mockShipment)

      const result = await service.create('org1', dto)

      expect(prisma.shipment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            clientId: 'c1',
            organizationId: 'org1',
            items: {
              create: [{ productId: 'p1', quantity: 5, unitPrice: 10000 }],
            },
          }),
        }),
      )
      expect(result).toEqual(mockShipment)
    })
  })

  describe('updateStatus', () => {
    it('to SHIPPED: checks inventory and calls $transaction to update shipment + decrement inventory', async () => {
      const shipmentItems = [{ id: 'si1', shipmentId: 's1', productId: 'p1', quantity: 5 }]
      ;(prisma.shipment.findFirst as jest.Mock)
        .mockResolvedValueOnce(mockShipment)
        .mockResolvedValue(mockShipment)
      ;(prisma.shipmentItem.findMany as jest.Mock).mockResolvedValue(shipmentItems)
      ;(prisma.inventory.findUnique as jest.Mock).mockResolvedValue({ productId: 'p1', quantity: 20 })
      ;(prisma.$transaction as jest.Mock).mockResolvedValue([{}, {}])
      ;(prisma.shipment.update as jest.Mock).mockReturnValue({} as any)
      ;(prisma.inventory.update as jest.Mock).mockReturnValue({} as any)

      await service.updateStatus('org1', 's1', { status: ShipmentStatus.SHIPPED })

      expect(prisma.inventory.findUnique).toHaveBeenCalledWith({ where: { productId: 'p1' } })
      expect(prisma.$transaction).toHaveBeenCalled()
      const txArg = (prisma.$transaction as jest.Mock).mock.calls[0][0]
      expect(Array.isArray(txArg)).toBe(true)
      expect(txArg).toHaveLength(2)
    })

    it('to SHIPPED: throws BadRequestException when inventory quantity < required', async () => {
      const shipmentItems = [{ id: 'si1', shipmentId: 's1', productId: 'p1', quantity: 10 }]
      ;(prisma.shipment.findFirst as jest.Mock).mockResolvedValue(mockShipment)
      ;(prisma.shipmentItem.findMany as jest.Mock).mockResolvedValue(shipmentItems)
      ;(prisma.inventory.findUnique as jest.Mock).mockResolvedValue({ productId: 'p1', quantity: 3 })

      await expect(
        service.updateStatus('org1', 's1', { status: ShipmentStatus.SHIPPED }),
      ).rejects.toThrow(BadRequestException)

      expect(prisma.$transaction).not.toHaveBeenCalled()
    })

    it('to SHIPPED: throws BadRequestException when inventory record missing', async () => {
      const shipmentItems = [{ id: 'si1', shipmentId: 's1', productId: 'p1', quantity: 5 }]
      ;(prisma.shipment.findFirst as jest.Mock).mockResolvedValue(mockShipment)
      ;(prisma.shipmentItem.findMany as jest.Mock).mockResolvedValue(shipmentItems)
      ;(prisma.inventory.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(
        service.updateStatus('org1', 's1', { status: ShipmentStatus.SHIPPED }),
      ).rejects.toThrow(BadRequestException)
    })

    it('to DELIVERED: updates status and deliveredAt without touching inventory', async () => {
      const deliveredShipment = { ...mockShipment, status: ShipmentStatus.DELIVERED, deliveredAt: new Date() }
      ;(prisma.shipment.findFirst as jest.Mock).mockResolvedValue(mockShipment)
      ;(prisma.shipment.update as jest.Mock).mockResolvedValue(deliveredShipment)

      const result = await service.updateStatus('org1', 's1', { status: ShipmentStatus.DELIVERED })

      expect(prisma.inventory.findUnique).not.toHaveBeenCalled()
      expect(prisma.$transaction).not.toHaveBeenCalled()
      expect(prisma.shipment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 's1' },
          data: expect.objectContaining({ status: ShipmentStatus.DELIVERED, deliveredAt: expect.any(Date) }),
        }),
      )
      expect(result).toEqual(deliveredShipment)
    })

    it('throws NotFoundException when shipment not found', async () => {
      ;(prisma.shipment.findFirst as jest.Mock).mockResolvedValue(null)
      await expect(
        service.updateStatus('org1', 'missing', { status: ShipmentStatus.SHIPPED }),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('throws BadRequestException if status is not REQUESTED', async () => {
      const shippedShipment = { ...mockShipment, status: ShipmentStatus.SHIPPED }
      ;(prisma.shipment.findFirst as jest.Mock).mockResolvedValue(shippedShipment)

      await expect(service.remove('org1', 's1')).rejects.toThrow(BadRequestException)
      expect(prisma.shipmentItem.deleteMany).not.toHaveBeenCalled()
    })

    it('calls deleteMany(items) then delete(shipment) when status is REQUESTED', async () => {
      ;(prisma.shipment.findFirst as jest.Mock).mockResolvedValue(mockShipment)
      ;(prisma.shipmentItem.deleteMany as jest.Mock).mockResolvedValue({ count: 1 })
      ;(prisma.shipment.delete as jest.Mock).mockResolvedValue(mockShipment)

      await service.remove('org1', 's1')

      expect(prisma.shipmentItem.deleteMany).toHaveBeenCalledWith({ where: { shipmentId: 's1' } })
      expect(prisma.shipment.delete).toHaveBeenCalledWith({ where: { id: 's1' } })
    })
  })
})
