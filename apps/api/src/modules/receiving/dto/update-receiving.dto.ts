import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ReceivingStatus } from '@prisma/client'

export class UpdateReceivingDto {
  @ApiPropertyOptional({ enum: ReceivingStatus })
  @IsOptional()
  @IsEnum(ReceivingStatus)
  status?: ReceivingStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string
}
