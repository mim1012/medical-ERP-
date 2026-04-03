import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ReceivingStatus } from '@prisma/client'

export class QueryReceivingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supplier?: string

  @ApiPropertyOptional({ enum: ReceivingStatus })
  @IsOptional()
  @IsEnum(ReceivingStatus)
  status?: ReceivingStatus
}
