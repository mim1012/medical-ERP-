import { Controller, Get, Param, Query, Headers } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { LogService } from './log.service'
import { QueryLogDto } from './dto/query-log.dto'

@ApiTags('log')
@ApiBearerAuth()
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  private getOrgId(headers: Record<string, string>): string {
    return headers['x-organization-id'] ?? 'default'
  }

  @Get()
  @ApiOperation({ summary: '감사 로그 목록 조회' })
  findAll(@Headers() headers: Record<string, string>, @Query() query: QueryLogDto) {
    return this.logService.findAll(this.getOrgId(headers), query)
  }

  @Get(':id')
  @ApiOperation({ summary: '감사 로그 상세 조회' })
  findOne(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.logService.findOne(this.getOrgId(headers), id)
  }
}
