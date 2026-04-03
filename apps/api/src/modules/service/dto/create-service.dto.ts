import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ServiceType } from '@prisma/client'

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  clientId!: string

  @ApiProperty({ enum: ServiceType })
  @IsEnum(ServiceType)
  type!: ServiceType

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignee?: string
}
