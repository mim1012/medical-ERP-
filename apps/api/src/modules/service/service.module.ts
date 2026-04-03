import { Module } from '@nestjs/common'
import { ServiceController } from './service.controller'
import { ServiceCaseService } from './service.service'

@Module({
  controllers: [ServiceController],
  providers: [ServiceCaseService],
})
export class ServiceModule {}
