import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { SettlementStatus, SettlementType } from './create-settlement.dto'

export class QuerySettlementDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientId?: string

  @ApiPropertyOptional({ enum: SettlementStatus })
  @IsOptional()
  @IsEnum(SettlementStatus)
  status?: SettlementStatus

  @ApiPropertyOptional({ enum: SettlementType })
  @IsOptional()
  @IsEnum(SettlementType)
  type?: SettlementType
}
