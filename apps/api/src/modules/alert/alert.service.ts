import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { QueryAlertDto } from './dto/query-alert.dto'

// Models will be added via migration
@Injectable()
export class AlertService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, query: QueryAlertDto) {
    const { isRead } = query
    return this.prisma.notification.findMany({
      where: {
        organizationId,
        ...(isRead !== undefined && { isRead }),
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getUnreadCount(organizationId: string) {
    const count = await this.prisma.notification.count({
      where: { organizationId, isRead: false },
    })
    return { count }
  }

  async markRead(organizationId: string, id: string) {
    const alert = await this.prisma.notification.findFirst({
      where: { id, organizationId },
    })
    if (!alert) throw new NotFoundException(`Alert ${id} not found`)
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })
  }

  async markAllRead(organizationId: string) {
    return this.prisma.notification.updateMany({
      where: { organizationId, isRead: false },
      data: { isRead: true },
    })
  }

  async remove(organizationId: string, id: string) {
    const alert = await this.prisma.notification.findFirst({
      where: { id, organizationId },
    })
    if (!alert) throw new NotFoundException(`Alert ${id} not found`)
    return this.prisma.notification.delete({ where: { id } })
  }
}
