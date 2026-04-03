import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ServiceStatus, ServiceType } from '@prisma/client'

export class QueryServiceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientId?: string

  @ApiPropertyOptional({ enum: ServiceType })
  @IsOptional()
  @IsEnum(ServiceType)
  type?: ServiceType

  @ApiPropertyOptional({ enum: ServiceStatus })
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus
}
