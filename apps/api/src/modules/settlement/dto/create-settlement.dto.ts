import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator'

export enum SettlementType {
  RECEIVABLE = 'RECEIVABLE',
  PAYABLE = 'PAYABLE',
}

export enum SettlementStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
}

export class CreateSettlementDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientId: string

  @ApiProperty({ enum: SettlementType })
  @IsEnum(SettlementType)
  type: SettlementType

  @ApiProperty()
  @IsNumber()
  amount: number

  @ApiPropertyOptional({ enum: SettlementStatus })
  @IsOptional()
  @IsEnum(SettlementStatus)
  status?: SettlementStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string
}
