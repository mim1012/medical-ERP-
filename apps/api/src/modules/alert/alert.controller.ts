import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Headers,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AlertService } from './alert.service'
import { QueryAlertDto } from './dto/query-alert.dto'

@ApiTags('alert')
@ApiBearerAuth()
@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  private getOrgId(headers: Record<string, string>): string {
    return headers['x-organization-id'] ?? 'default'
  }

  @Get()
  @ApiOperation({ summary: '알림 목록 조회' })
  findAll(@Headers() headers: Record<string, string>, @Query() query: QueryAlertDto) {
    return this.alertService.findAll(this.getOrgId(headers), query)
  }

  @Get('unread-count')
  @ApiOperation({ summary: '읽지 않은 알림 수 조회' })
  getUnreadCount(@Headers() headers: Record<string, string>) {
    return this.alertService.getUnreadCount(this.getOrgId(headers))
  }

  @Patch('read-all')
  @ApiOperation({ summary: '전체 알림 읽음 처리' })
  markAllRead(@Headers() headers: Record<string, string>) {
    return this.alertService.markAllRead(this.getOrgId(headers))
  }

  @Patch(':id/read')
  @ApiOperation({ summary: '알림 읽음 처리' })
  markRead(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.alertService.markRead(this.getOrgId(headers), id)
  }

  @Delete(':id')
  @ApiOperation({ summary: '알림 삭제' })
  remove(@Headers() headers: Record<string, string>, @Param('id') id: string) {
    return this.alertService.remove(this.getOrgId(headers), id)
  }
}
