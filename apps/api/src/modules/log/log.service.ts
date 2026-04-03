import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { QueryLogDto } from './dto/query-log.dto'

// Models will be added via migration
@Injectable()
export class LogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, query: QueryLogDto) {
    const { action, resource, userId, from, to } = query
    return this.prisma.auditLog.findMany({
      where: {
        organizationId,
        ...(action && { action: { contains: action } }),
        ...(resource && { resource }),
        ...(userId && { userId }),
        ...((from || to) && {
          createdAt: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) }),
          },
        }),
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(organizationId: string, id: string) {
    const log = await this.prisma.auditLog.findFirst({
      where: { id, organizationId },
    })
    if (!log) throw new NotFoundException(`Log ${id} not found`)
    return log
  }

  async createLog(
    organizationId: string,
    action: string,
    resource: string,
    resourceId?: string,
    userId?: string,
    details?: Record<string, unknown>,
  ) {
    return this.prisma.auditLog.create({
      data: {
        organizationId,
        action,
        resource,
        resourceId,
        userId,
        details: details as object,
      },
    })
  }
}
