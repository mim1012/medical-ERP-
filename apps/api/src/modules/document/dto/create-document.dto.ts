import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator'

export enum DocumentType {
  CONTRACT = 'CONTRACT',
  CERTIFICATE = 'CERTIFICATE',
  MANUAL = 'MANUAL',
  WARRANTY = 'WARRANTY',
  OTHER = 'OTHER',
}

export class CreateDocumentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  type: DocumentType

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileUrl?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiresAt?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string
}
