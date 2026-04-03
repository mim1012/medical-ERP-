import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateTaxInvoiceDto, TaxInvoiceStatus } from './dto/create-tax-invoice.dto'
import { UpdateTaxInvoiceDto } from './dto/update-tax-invoice.dto'
import { QueryTaxInvoiceDto } from './dto/query-tax-invoice.dto'

// Models will be added via migration
@Injectable()
export class TaxInvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  private generateInvoiceNumber(): string {
    const now = new Date()
    const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
    const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
    return `TI-${yyyymm}-${seq}`
  }

  async findAll(organizationId: string, query: QueryTaxInvoiceDto) {
    const { clientId, status } = query
    return this.prisma.taxInvoice.findMany({
      where: {
        organizationId,
        ...(clientId && { clientId }),
        ...(status && { status }),
      },
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(organizationId: string, id: string) {
    const invoice = await this.prisma.taxInvoice.findFirst({
      where: { id, organizationId },
      include: { client: true },
    })
    if (!invoice) throw new NotFoundException(`TaxInvoice ${id} not found`)
    return invoice
  }

  async create(organizationId: string, dto: CreateTaxInvoiceDto) {
    return this.prisma.taxInvoice.create({
      data: {
        ...dto,
        invoiceNumber: this.generateInvoiceNumber(),
        status: dto.status ?? TaxInvoiceStatus.DRAFT,
        organizationId,
      },
      include: { client: true },
    })
  }

  async update(organizationId: string, id: string, dto: UpdateTaxInvoiceDto) {
    await this.findOne(organizationId, id)
    return this.prisma.taxInvoice.update({
      where: { id },
      data: dto,
      include: { client: true },
    })
  }

  async issue(organizationId: string, id: string) {
    const invoice = await this.findOne(organizationId, id)
    if (invoice.status !== TaxInvoiceStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT invoices can be issued')
    }
    return this.prisma.taxInvoice.update({
      where: { id },
      data: { status: TaxInvoiceStatus.ISSUED, issuedAt: new Date() },
      include: { client: true },
    })
  }

  async remove(organizationId: string, id: string) {
    const invoice = await this.findOne(organizationId, id)
    if (invoice.status !== TaxInvoiceStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT invoices can be deleted')
    }
    return this.prisma.taxInvoice.delete({ where: { id } })
  }
}
