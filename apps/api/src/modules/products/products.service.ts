import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { QueryProductDto } from './dto/query-product.dto'

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, query: QueryProductDto) {
    const { name, category, page = 1, limit = 20 } = query
    const skip = (page - 1) * limit

    const where = {
      organizationId,
      ...(name && { name: { contains: name, mode: 'insensitive' as const } }),
      ...(category && { category: { contains: category, mode: 'insensitive' as const } }),
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.product.count({ where }),
    ])

    return { data, meta: { total, page, limit } }
  }

  async findOne(id: string, organizationId: string) {
    const product = await this.prisma.product.findFirst({ where: { id, organizationId } })
    if (!product) throw new NotFoundException(`Product ${id} not found`)
    return product
  }

  async create(organizationId: string, dto: CreateProductDto) {
    return this.prisma.product.create({ data: { ...dto, organizationId } })
  }

  async update(id: string, organizationId: string, dto: UpdateProductDto) {
    await this.findOne(id, organizationId)
    return this.prisma.product.update({ where: { id }, data: dto })
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId)
    return this.prisma.product.delete({ where: { id } })
  }
}
