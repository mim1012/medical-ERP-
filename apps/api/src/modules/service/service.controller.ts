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
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AuthUser } from '../../common/types/auth-user.type'

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceCaseService: ServiceCaseService) {}

  @Get()
  @ApiOperation({ summary: 'A/S 목록 조회' })
  @ApiResponse({ status: 200, description: 'A/S 목록 반환' })
  findAll(@CurrentUser() user: AuthUser, @Query() query: QueryServiceDto) {
    return this.serviceCaseService.findAll(user.organizationId, query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'A/S 상세 조회' })
  @ApiResponse({ status: 200, description: 'A/S 상세 반환' })
  @ApiResponse({ status: 404, description: 'A/S 없음' })
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.serviceCaseService.findOne(user.organizationId, id)
  }

  @Post()
  @ApiOperation({ summary: 'A/S 접수' })
  @ApiResponse({ status: 201, description: 'A/S 접수 완료' })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateServiceDto) {
    return this.serviceCaseService.create(user.organizationId, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'A/S 수정 (상태, 담당자, 해결일시)' })
  @ApiResponse({ status: 200, description: 'A/S 업데이트 완료' })
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.serviceCaseService.update(user.organizationId, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'A/S 삭제' })
  @ApiResponse({ status: 200, description: 'A/S 삭제 완료' })
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.serviceCaseService.remove(user.organizationId, id)
  }
}
