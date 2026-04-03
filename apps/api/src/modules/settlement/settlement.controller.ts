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
import { SettlementService } from './settlement.service'
import { CreateSettlementDto } from './dto/create-settlement.dto'
import { UpdateSettlementDto } from './dto/update-settlement.dto'
import { QuerySettlementDto } from './dto/query-settlement.dto'

@ApiTags('settlement')
@ApiBearerAuth()
@Controller('settlement')
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}

  private getOrgId(headers: Record<string, string>): string {
    return headers['x-organization-id'] ?? 'default'
  }

  @Get()
  @ApiOperation({ summary: '정산 목록 조회' })
  findAll(@Headers() headers: Record<string, string>, @Query() query: QuerySettlementDto) {
    return this.settlementService.findAll(this.getOrgId(headers), query)
  }

  @Get(':id')
  @ApiOperation({ summary: '정산 상세 조회' })
  findOne(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.settlementService.findOne(this.getOrgId(headers), id)
  }

  @Post()
  @ApiOperation({ summary: '정산 생성' })
  create(@Headers() headers: Record<string, string>, @Body() dto: CreateSettlementDto) {
    return this.settlementService.create(this.getOrgId(headers), dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: '정산 수정' })
  update(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body() dto: UpdateSettlementDto,
  ) {
    return this.settlementService.update(this.getOrgId(headers), id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '정산 삭제' })
  remove(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.settlementService.remove(this.getOrgId(headers), id)
  }
}
