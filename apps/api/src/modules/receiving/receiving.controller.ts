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
import { ReceivingService } from './receiving.service'
import { CreateReceivingDto } from './dto/create-receiving.dto'
import { UpdateReceivingDto } from './dto/update-receiving.dto'
import { QueryReceivingDto } from './dto/query-receiving.dto'

// TODO: Replace with real auth guard that provides organizationId
const MOCK_ORG_ID = 'org-placeholder'

@ApiTags('receiving')
@Controller('receiving')
export class ReceivingController {
  constructor(private readonly receivingService: ReceivingService) {}

  @Get()
  @ApiOperation({ summary: '입고 목록 조회' })
  @ApiResponse({ status: 200, description: '입고 목록 반환' })
  findAll(@Query() query: QueryReceivingDto) {
    return this.receivingService.findAll(MOCK_ORG_ID, query)
  }

  @Get(':id')
  @ApiOperation({ summary: '입고 상세 조회' })
  @ApiResponse({ status: 200, description: '입고 상세 반환 (items 포함)' })
  @ApiResponse({ status: 404, description: '입고 없음' })
  findOne(@Param('id') id: string) {
    return this.receivingService.findOne(MOCK_ORG_ID, id)
  }

  @Post()
  @ApiOperation({ summary: '입고 생성' })
  @ApiResponse({ status: 201, description: '입고 생성 완료' })
  create(@Body() dto: CreateReceivingDto) {
    return this.receivingService.create(MOCK_ORG_ID, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: '입고 상태 변경' })
  @ApiResponse({ status: 200, description: '입고 업데이트 완료' })
  update(@Param('id') id: string, @Body() dto: UpdateReceivingDto) {
    return this.receivingService.update(MOCK_ORG_ID, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '입고 삭제' })
  @ApiResponse({ status: 200, description: '입고 삭제 완료' })
  remove(@Param('id') id: string) {
    return this.receivingService.remove(MOCK_ORG_ID, id)
  }
}
