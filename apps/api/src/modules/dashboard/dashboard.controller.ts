import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { DashboardService } from './dashboard.service'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

interface AuthUser {
  id: string
  email: string
  organizationId: string
}

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(@CurrentUser() user: AuthUser) {
    return this.dashboardService.getStats(user.organizationId)
  }
}
