import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(organizationId: string) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    }).reverse()

    const [
      totalClients,
      totalProducts,
      monthlyShipments,
      openServiceCases,
      pendingSettlements,
      recentNotifications,
      monthlySettlements,
      recentShipments,
      allInventory,
    ] = await Promise.all([
      this.prisma.client.count({ where: { organizationId } }),
      this.prisma.product.count({ where: { organizationId } }),
      this.prisma.shipment.count({
        where: { organizationId, createdAt: { gte: startOfMonth } },
      }),
      this.prisma.serviceCase.count({
        where: { organizationId, status: { in: ['OPEN', 'IN_PROGRESS'] } },
      }),
      this.prisma.settlement.aggregate({
        where: {
          organizationId,
          type: 'RECEIVABLE',
          status: { in: ['PENDING', 'PARTIAL'] },
        },
        _sum: { amount: true },
      }),
      this.prisma.notification.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      Promise.all(
        last6Months.map(async ({ year, month }) => {
          const start = new Date(year, month, 1)
          const end = new Date(year, month + 1, 0, 23, 59, 59)
          const result = await this.prisma.settlement.aggregate({
            where: {
              organizationId,
              type: 'RECEIVABLE',
              status: 'COMPLETED',
              settledAt: { gte: start, lte: end },
            },
            _sum: { amount: true },
          })
          return {
            month: `${month + 1}월`,
            revenue: Number(result._sum.amount ?? 0),
          }
        }),
      ),
      this.prisma.shipment.findMany({
        where: { organizationId, createdAt: { gte: sevenDaysAgo } },
        include: { client: { select: { name: true } }, _count: { select: { items: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.inventory.findMany({
        where: { organizationId },
        select: { quantity: true, safetyStock: true },
      }),
    ])

    const lowStockCount = allInventory.filter(
      (i) => i.quantity < i.safetyStock,
    ).length

    return {
      totalClients,
      totalProducts,
      monthlyShipments,
      lowStockCount,
      openServiceCases,
      unpaidBalance: Number(pendingSettlements._sum.amount ?? 0),
      recentNotifications,
      monthlyRevenueChart: monthlySettlements,
      recentShipments: recentShipments.map((s) => ({
        id: s.id,
        clientName: s.client.name,
        itemCount: s._count.items,
        status: s.status,
        createdAt: s.createdAt.toISOString(),
      })),
    }
  }
}
