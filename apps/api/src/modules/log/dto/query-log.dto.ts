import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsOptional, IsString } from 'class-validator'

export class QueryLogDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  action?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resource?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string

  @ApiPropertyOptional({ description: 'ISO date string for range start' })
  @IsOptional()
  @IsDateString()
  from?: string

  @ApiPropertyOptional({ description: 'ISO date string for range end' })
  @IsOptional()
  @IsDateString()
  to?: string
}
