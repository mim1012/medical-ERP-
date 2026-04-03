import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ShipmentStatus } from '@prisma/client'

export class UpdateShippingDto {
  @ApiPropertyOptional({ enum: ShipmentStatus })
  @IsOptional()
  @IsEnum(ShipmentStatus)
  status?: ShipmentStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string
}
