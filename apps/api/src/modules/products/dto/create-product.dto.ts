import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brand?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  licenseNumber?: string

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPrice?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string
}
