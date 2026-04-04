import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { ReceivingService } from './receiving.service'
import { PrismaService } from '../../prisma/prisma.service'
import { ReceivingStatus } from '@prisma/client'

describe('ReceivingService', () => {
  let service: ReceivingService
  let prisma: jest.Mocked<PrismaService>

  const mockReceiving = {
    id: 'r1',
    organizationId: 'org1',
    supplier: 'Supplier A',
    status: ReceivingStatus.PENDING,
    notes: null,
    receivedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      { id: 'ri1', receivingId: 'r1', productId: 'p1', quantity: 10, unitPrice: 5000, product: { id: 'p1', name: 'Product A' } },
    ],
  }

  beforeEach(async () => {
    const mockPrisma = {
      receiving: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      receivingItem: { deleteMany: jest.fn() },
      inventory: {
        upsert: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
      },
      $transaction: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceivingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile()

    service = module.get<ReceivingService>(ReceivingService)
    prisma = module.get(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOne', () => {
    it('returns receiving when found', async () => {
      ;(prisma.receiving.findFirst as jest.Mock).mockResolvedValue(mockReceiving)
      const result = await service.findOne('org1', 'r1')
      expect(result).toEqual(mockReceiving)
      expect(prisma.receiving.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'r1', organizationId: 'org1' } }),
      )
    })

    it('throws NotFoundException when not found', async () => {
      ;(prisma.receiving.findFirst as jest.Mock).mockResolvedValue(null)
      await expect(service.findOne('org1', 'missing')).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('creates receiving with items via Prisma', async () => {
      const dto = {
        supplier: 'Supplier A',
        notes: 'test notes',
        items: [{ productId: 'p1', quantity: 10, unitPrice: 5000 }],
      }
      ;(prisma.receiving.create as jest.Mock).mockResolvedValue(mockReceiving)

      const result = await service.create('org1', dto)

      expect(prisma.receiving.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            supplier: 'Supplier A',
            organizationId: 'org1',
            items: {
              create: [{ productId: 'p1', quantity: 10, unitPrice: 5000 }],
            },
          }),
        }),
      )
      expect(result).toEqual(mockReceiving)
    })
  })

  describe('update', () => {
    it('update to COMPLETED calls $transaction with receiving.update and inventory.upsert per item', async () => {
      const receivingWithItems = {
        ...mockReceiving,
        items: [
          { productId: 'p1', quantity: 10 },
          { productId: 'p2', quantity: 5 },
        ],
      }
      ;(prisma.receiving.findFirst as jest.Mock)
        .mockResolvedValueOnce(mockReceiving)
        .mockResolvedValueOnce(receivingWithItems)
        .mockResolvedValue(mockReceiving)

      ;(prisma.$transaction as jest.Mock).mockResolvedValue([{}, {}, {}])
      ;(prisma.receiving.update as jest.Mock).mockReturnValue({} as any)
      ;(prisma.inventory.upsert as jest.Mock).mockReturnValue({} as any)

      await service.update('org1', 'r1', { status: ReceivingStatus.COMPLETED })

      expect(prisma.$transaction).toHaveBeenCalled()
      const txArg = (prisma.$transaction as jest.Mock).mock.calls[0][0]
      expect(Array.isArray(txArg)).toBe(true)
      // 1 receiving.update + 2 inventory.upsert calls
      expect(txArg).toHaveLength(3)
    })

    it('update to COMPLETED increments inventory for each item', async () => {
      const receivingWithItems = {
        ...mockReceiving,
        items: [{ productId: 'p1', quantity: 10 }],
      }
      ;(prisma.receiving.findFirst as jest.Mock)
        .mockResolvedValueOnce(mockReceiving)
        .mockResolvedValueOnce(receivingWithItems)
        .mockResolvedValue(mockReceiving)

      ;(prisma.$transaction as jest.Mock).mockResolvedValue([{}, {}])
      ;(prisma.receiving.update as jest.Mock).mockReturnValue({} as any)
      ;(prisma.inventory.upsert as jest.Mock).mockReturnValue({} as any)

      await service.update('org1', 'r1', { status: ReceivingStatus.COMPLETED })

      expect(prisma.inventory.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { productId: 'p1' },
          update: { quantity: { increment: 10 } },
          create: expect.objectContaining({ productId: 'p1', quantity: 10 }),
        }),
      )
    })

    it('update to non-COMPLETED status does NOT call inventory.upsert', async () => {
      ;(prisma.receiving.findFirst as jest.Mock).mockResolvedValue(mockReceiving)
      ;(prisma.receiving.update as jest.Mock).mockResolvedValue(mockReceiving)

      await service.update('org1', 'r1', { status: ReceivingStatus.REJECTED })

      expect(prisma.inventory.upsert).not.toHaveBeenCalled()
      expect(prisma.$transaction).not.toHaveBeenCalled()
      expect(prisma.receiving.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'r1' } }),
      )
    })
  })

  describe('remove', () => {
    it('calls deleteMany(receivingItems) then delete(receiving)', async () => {
      ;(prisma.receiving.findFirst as jest.Mock).mockResolvedValue(mockReceiving)
      ;(prisma.receivingItem.deleteMany as jest.Mock).mockResolvedValue({ count: 1 })
      ;(prisma.receiving.delete as jest.Mock).mockResolvedValue(mockReceiving)

      await service.remove('org1', 'r1')

      expect(prisma.receivingItem.deleteMany).toHaveBeenCalledWith({ where: { receivingId: 'r1' } })
      expect(prisma.receiving.delete).toHaveBeenCalledWith({ where: { id: 'r1' } })
    })

    it('throws NotFoundException when receiving not found on remove', async () => {
      ;(prisma.receiving.findFirst as jest.Mock).mockResolvedValue(null)
      await expect(service.remove('org1', 'missing')).rejects.toThrow(NotFoundException)
    })
  })
})
