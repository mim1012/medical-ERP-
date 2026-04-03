import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateDocumentDto } from './dto/create-document.dto'
import { UpdateDocumentDto } from './dto/update-document.dto'
import { QueryDocumentDto } from './dto/query-document.dto'

// Models will be added via migration
@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, query: QueryDocumentDto) {
    const { clientId, type } = query
    return this.prisma.document.findMany({
      where: {
        organizationId,
        ...(clientId && { clientId }),
        ...(type && { type }),
      },
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(organizationId: string, id: string) {
    const doc = await this.prisma.document.findFirst({
      where: { id, organizationId },
      include: { client: true },
    })
    if (!doc) throw new NotFoundException(`Document ${id} not found`)
    return doc
  }

  async create(organizationId: string, dto: CreateDocumentDto) {
    return this.prisma.document.create({
      data: {
        ...dto,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        organizationId,
      },
      include: { client: true },
    })
  }

  async update(organizationId: string, id: string, dto: UpdateDocumentDto) {
    await this.findOne(organizationId, id)
    return this.prisma.document.update({
      where: { id },
      data: {
        ...dto,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
      include: { client: true },
    })
  }

  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id)
    return this.prisma.document.delete({ where: { id } })
  }
}
