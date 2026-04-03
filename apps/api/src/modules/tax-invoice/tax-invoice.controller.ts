import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { TaxInvoiceService } from './tax-invoice.service'
import { CreateTaxInvoiceDto } from './dto/create-tax-invoice.dto'
import { UpdateTaxInvoiceDto } from './dto/update-tax-invoice.dto'
import { QueryTaxInvoiceDto } from './dto/query-tax-invoice.dto'

@ApiTags('tax-invoice')
@ApiBearerAuth()
@Controller('tax-invoice')
export class TaxInvoiceController {
  constructor(private readonly taxInvoiceService: TaxInvoiceService) {}

  private getOrgId(headers: Record<string, string>): string {
    return headers['x-organization-id'] ?? 'default'
  }

  @Get()
  @ApiOperation({ summary: '세금계산서 목록 조회' })
  findAll(@Headers() headers: Record<string, string>, @Query() query: QueryTaxInvoiceDto) {
    return this.taxInvoiceService.findAll(this.getOrgId(headers), query)
  }

  @Get(':id')
  @ApiOperation({ summary: '세금계산서 상세 조회' })
  findOne(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.taxInvoiceService.findOne(this.getOrgId(headers), id)
  }

  @Post()
  @ApiOperation({ summary: '세금계산서 생성 (invoiceNumber 자동생성)' })
  create(@Headers() headers: Record<string, string>, @Body() dto: CreateTaxInvoiceDto) {
    return this.taxInvoiceService.create(this.getOrgId(headers), dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: '세금계산서 수정' })
  update(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() dto: UpdateTaxInvoiceDto,
  ) {
    return this.taxInvoiceService.update(this.getOrgId(headers), id, dto)
  }

  @Patch(':id/issue')
  @ApiOperation({ summary: '세금계산서 발행 (DRAFT → ISSUED)' })
  issue(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.taxInvoiceService.issue(this.getOrgId(headers), id)
  }

  @Delete(':id')
  @ApiOperation({ summary: '세금계산서 삭제 (DRAFT만 가능)' })
  remove(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.taxInvoiceService.remove(this.getOrgId(headers), id)
  }
}
