import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ClientType } from '@prisma/client'

export class QueryClientDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ enum: ClientType })
  @IsOptional()
  @IsEnum(ClientType)
  type?: ClientType

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20
}
