import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { TaxInvoiceStatus } from './create-tax-invoice.dto'

export class UpdateTaxInvoiceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  tax?: number

  @ApiPropertyOptional({ enum: TaxInvoiceStatus })
  @IsOptional()
  @IsEnum(TaxInvoiceStatus)
  status?: TaxInvoiceStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string
}
