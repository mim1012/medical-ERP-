import { Controller, Get } from '@nestjs/common'
import { Public } from '../common/decorators/public.decorator'

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
    }
  }
}
