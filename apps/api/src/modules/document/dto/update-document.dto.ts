import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator'
import { DocumentType } from './create-document.dto'

export class UpdateDocumentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ enum: DocumentType })
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType

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
