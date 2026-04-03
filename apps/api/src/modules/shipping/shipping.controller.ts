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
import { ShippingService } from './shipping.service'
import { CreateShippingDto } from './dto/create-shipping.dto'
import { UpdateShippingDto } from './dto/update-shipping.dto'
import { QueryShippingDto } from './dto/query-shipping.dto'

// TODO: Replace with real auth guard that provides organizationId
const MOCK_ORG_ID = 'org-placeholder'

@ApiTags('shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get()
  @ApiOperation({ summary: '출고 목록 조회' })
  @ApiResponse({ status: 200, description: '출고 목록 반환' })
  findAll(@Query() query: QueryShippingDto) {
    return this.shippingService.findAll(MOCK_ORG_ID, query)
  }

  @Get(':id')
  @ApiOperation({ summary: '출고 상세 조회' })
  @ApiResponse({ status: 200, description: '출고 상세 반환 (items, client 포함)' })
  @ApiResponse({ status: 404, description: '출고 없음' })
  findOne(@Param('id') id: string) {
    return this.shippingService.findOne(MOCK_ORG_ID, id)
  }

  @Post()
  @ApiOperation({ summary: '출고 생성' })
  @ApiResponse({ status: 201, description: '출고 생성 완료' })
  create(@Body() dto: CreateShippingDto) {
    return this.shippingService.create(MOCK_ORG_ID, dto)
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '출고 상태 변경 (APPROVED → SHIPPED → DELIVERED)' })
  @ApiResponse({ status: 200, description: '출고 상태 업데이트 완료' })
  @ApiResponse({ status: 400, description: '재고 부족 또는 상태 오류' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateShippingDto) {
    return this.shippingService.updateStatus(MOCK_ORG_ID, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '출고 삭제 (REQUESTED 상태만)' })
  @ApiResponse({ status: 200, description: '출고 삭제 완료' })
  @ApiResponse({ status: 400, description: 'REQUESTED 상태가 아닌 경우 삭제 불가' })
  remove(@Param('id') id: string) {
    return this.shippingService.remove(MOCK_ORG_ID, id)
  }
}
