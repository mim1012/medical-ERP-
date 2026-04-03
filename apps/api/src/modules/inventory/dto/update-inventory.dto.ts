import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateInventoryDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity!: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  safetyStock?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lotNumber?: string
}
