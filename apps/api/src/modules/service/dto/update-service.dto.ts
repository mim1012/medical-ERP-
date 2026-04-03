import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ServiceStatus } from '@prisma/client'

export class UpdateServiceDto {
  @ApiPropertyOptional({ enum: ServiceStatus })
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignee?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string
}
