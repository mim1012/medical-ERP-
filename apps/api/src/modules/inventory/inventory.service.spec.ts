import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { PrismaService } from '../../prisma/prisma.service'

describe('InventoryService', () => {
  let service: InventoryService
  let prisma: jest.Mocked<PrismaService>

  const mockInventory = {
    id: 'inv1',
    organizationId: 'org1',
    productId: 'p1',
    quantity: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
    product: { id: 'p1', name: 'Product A' },
  }

  beforeEach(async () => {
    const mockPrisma = {
      inventory: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile()

    service = module.get<InventoryService>(InventoryService)
    prisma = module.get(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('returns items scoped to organizationId', async () => {
      ;(prisma.inventory.findMany as jest.Mock).mockResolvedValue([mockInventory])

      const result = await service.findAll('org1')

      expect(prisma.inventory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { organizationId: 'org1' } }),
      )
      expect(result.data).toEqual([mockInventory])
      expect(result.meta.total).toBe(1)
    })

    it('returns empty list when no inventory for org', async () => {
      ;(prisma.inventory.findMany as jest.Mock).mockResolvedValue([])

      const result = await service.findAll('org2')

      expect(result.data).toEqual([])
      expect(result.meta.total).toBe(0)
    })
  })

  describe('findOne', () => {
    it('returns inventory when found', async () => {
      ;(prisma.inventory.findFirst as jest.Mock).mockResolvedValue(mockInventory)

      const result = await service.findOne('inv1', 'org1')

      expect(result).toEqual(mockInventory)
      expect(prisma.inventory.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'inv1', organizationId: 'org1' } }),
      )
    })

    it('throws NotFoundException for wrong org or missing id', async () => {
      ;(prisma.inventory.findFirst as jest.Mock).mockResolvedValue(null)

      await expect(service.findOne('inv1', 'wrong-org')).rejects.toThrow(NotFoundException)
    })
  })

  describe('update', () => {
    it('calls prisma.inventory.update with correct data', async () => {
      const updatedInventory = { ...mockInventory, quantity: 100 }
      ;(prisma.inventory.findFirst as jest.Mock).mockResolvedValue(mockInventory)
      ;(prisma.inventory.update as jest.Mock).mockResolvedValue(updatedInventory)

      const result = await service.update('inv1', 'org1', { quantity: 100 })

      expect(prisma.inventory.update).toHaveBeenCalledWith({
        where: { id: 'inv1' },
        data: { quantity: 100 },
      })
      expect(result).toEqual(updatedInventory)
    })

    it('throws NotFoundException when inventory not found on update', async () => {
      ;(prisma.inventory.findFirst as jest.Mock).mockResolvedValue(null)

      await expect(service.update('missing', 'org1', { quantity: 10 })).rejects.toThrow(NotFoundException)
      expect(prisma.inventory.update).not.toHaveBeenCalled()
    })
  })

  describe('adjust', () => {
    it('adds positive delta using atomic increment', async () => {
      const adjustedInventory = { ...mockInventory, quantity: 60 }
      ;(prisma.inventory.findFirst as jest.Mock).mockResolvedValue(mockInventory)
      ;(prisma.inventory.update as jest.Mock).mockResolvedValue(adjustedInventory)

      const result = await service.adjust('inv1', 'org1', { quantity: 10 })

      expect(prisma.inventory.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'inv1' },
          data: { quantity: { increment: 10 } },
        }),
      )
      expect(result).toEqual(adjustedInventory)
    })

    it('subtracts negative delta using atomic increment', async () => {
      const adjustedInventory = { ...mockInventory, quantity: 40 }
      ;(prisma.inventory.findFirst as jest.Mock).mockResolvedValue(mockInventory)
      ;(prisma.inventory.update as jest.Mock).mockResolvedValue(adjustedInventory)

      const result = await service.adjust('inv1', 'org1', { quantity: -10 })

      expect(prisma.inventory.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'inv1' },
          data: { quantity: { increment: -10 } },
        }),
      )
      expect(result).toEqual(adjustedInventory)
    })

    it('throws BadRequestException when resulting quantity would be negative', async () => {
      ;(prisma.inventory.findFirst as jest.Mock).mockResolvedValue(mockInventory) // quantity: 50

      await expect(service.adjust('inv1', 'org1', { quantity: -60 })).rejects.toThrow(BadRequestException)
      expect(prisma.inventory.update).not.toHaveBeenCalled()
    })

    it('throws NotFoundException when inventory not found on adjust', async () => {
      ;(prisma.inventory.findFirst as jest.Mock).mockResolvedValue(null)

      await expect(service.adjust('missing', 'org1', { quantity: 5 })).rejects.toThrow(NotFoundException)
    })
  })
})
