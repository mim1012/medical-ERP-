import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { DocumentService } from './document.service'
import { CreateDocumentDto } from './dto/create-document.dto'
import { UpdateDocumentDto } from './dto/update-document.dto'
import { QueryDocumentDto } from './dto/query-document.dto'

@ApiTags('document')
@ApiBearerAuth()
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  private getOrgId(headers: Record<string, string>): string {
    return headers['x-organization-id'] ?? 'default'
  }

  @Get()
  @ApiOperation({ summary: '문서 목록 조회' })
  findAll(@Headers() headers: Record<string, string>, @Query() query: QueryDocumentDto) {
    return this.documentService.findAll(this.getOrgId(headers), query)
  }

  @Get(':id')
  @ApiOperation({ summary: '문서 상세 조회' })
  findOne(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.documentService.findOne(this.getOrgId(headers), id)
  }

  @Post()
  @ApiOperation({ summary: '문서 생성' })
  create(@Headers() headers: Record<string, string>, @Body() dto: CreateDocumentDto) {
    return this.documentService.create(this.getOrgId(headers), dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: '문서 수정' })
  update(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documentService.update(this.getOrgId(headers), id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '문서 삭제' })
  remove(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.documentService.remove(this.getOrgId(headers), id)
  }
}
