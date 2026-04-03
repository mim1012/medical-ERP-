import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsEnum, IsOptional, IsEmail } from 'class-validator'
import { ClientType } from '@prisma/client'

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  name!: string

  @ApiProperty({ enum: ClientType })
  @IsEnum(ClientType)
  type!: ClientType

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bizNumber?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manager?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string
}
