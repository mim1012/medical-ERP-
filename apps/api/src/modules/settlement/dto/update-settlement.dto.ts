import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsDateString, IsNumber } from 'class-validator'
import { SettlementStatus } from './create-settlement.dto'

export class UpdateSettlementDto {
  @ApiPropertyOptional({ enum: SettlementStatus })
  @IsOptional()
  @IsEnum(SettlementStatus)
  status?: SettlementStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  settledAt?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string
}
