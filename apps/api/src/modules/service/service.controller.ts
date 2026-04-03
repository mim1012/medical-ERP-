import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ServiceCaseService } from './service.service'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { QueryServiceDto } from './dto/query-service.dto'

// TODO: Replace with real auth guard that provides organizationId
const MOCK_ORG_ID = 'org-placeholder'

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceCaseService: ServiceCaseService) {}

  @Get()
  @ApiOperation({ summary: 'A/S 목록 조회' })
  @ApiResponse({ status: 200, description: 'A/S 목록 반환' })
  findAll(@Query() query: QueryServiceDto) {
    return this.serviceCaseService.findAll(MOCK_ORG_ID, query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'A/S 상세 조회' })
  @ApiResponse({ status: 200, description: 'A/S 상세 반환' })
  @ApiResponse({ status: 404, description: 'A/S 없음' })
  findOne(@Param('id') id: string) {
    return this.serviceCaseService.findOne(MOCK_ORG_ID, id)
  }

  @Post()
  @ApiOperation({ summary: 'A/S 접수' })
  @ApiResponse({ status: 201, description: 'A/S 접수 완료' })
  create(@Body() dto: CreateServiceDto) {
    return this.serviceCaseService.create(MOCK_ORG_ID, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'A/S 수정 (상태, 담당자, 해결일시)' })
  @ApiResponse({ status: 200, description: 'A/S 업데이트 완료' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.serviceCaseService.update(MOCK_ORG_ID, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'A/S 삭제' })
  @ApiResponse({ status: 200, description: 'A/S 삭제 완료' })
  remove(@Param('id') id: string) {
    return this.serviceCaseService.remove(MOCK_ORG_ID, id)
  }
}
