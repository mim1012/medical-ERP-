import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { DocumentType } from './create-document.dto'

export class QueryDocumentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientId?: string

  @ApiPropertyOptional({ enum: DocumentType })
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType
}
