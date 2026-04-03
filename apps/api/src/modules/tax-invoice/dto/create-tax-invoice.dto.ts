import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export enum TaxInvoiceStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  CANCELLED = 'CANCELLED',
}

export class CreateTaxInvoiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientId!: string

  @ApiProperty()
  @IsNumber()
  amount!: number

  @ApiProperty()
  @IsNumber()
  tax!: number

  @ApiPropertyOptional({ enum: TaxInvoiceStatus })
  @IsOptional()
  @IsEnum(TaxInvoiceStatus)
  status?: TaxInvoiceStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string
}
