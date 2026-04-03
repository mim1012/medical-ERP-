import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(organizationId: string) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalClients,
      totalProducts,
      monthlyShipments,
      pendingSettlements,
    ] = await Promise.all([
      this.prisma.client.count({ where: { organizationId } }),
      this.prisma.product.count({ where: { organizationId } }),
      this.prisma.shipment.count({
        where: { organizationId, createdAt: { gte: startOfMonth } },
      }),
      this.prisma.settlement.aggregate({
        where: { organizationId, status: { in: ['PENDING', 'PARTIAL'] } },
        _sum: { amount: true },
      }),
    ])

    return {
      totalClients,
      totalProducts,
      monthlyShipments,
      pendingSettlementAmount: pendingSettlements._sum.amount ?? 0,
    }
  }
}
