import { Type } from 'class-transformer'
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateReceivingItemDto {
  @ApiProperty()
  @IsString()
  productId!: string

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number

  @ApiProperty()
  @IsNumber()
  unitPrice!: number
}

export class CreateReceivingDto {
  @ApiProperty()
  @IsString()
  supplier!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string

  @ApiProperty({ type: [CreateReceivingItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReceivingItemDto)
  items!: CreateReceivingItemDto[]
}
