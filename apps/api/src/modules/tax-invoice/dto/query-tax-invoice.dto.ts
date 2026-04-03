import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { TaxInvoiceStatus } from './create-tax-invoice.dto'

export class QueryTaxInvoiceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientId?: string

  @ApiPropertyOptional({ enum: TaxInvoiceStatus })
  @IsOptional()
  @IsEnum(TaxInvoiceStatus)
  status?: TaxInvoiceStatus
}
