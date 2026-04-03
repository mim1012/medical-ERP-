import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { SupabaseAuthGuard } from './common/guards/supabase-auth.guard'
import { TenantMiddleware } from './common/middleware/tenant.middleware'
import { ClientsModule } from './modules/clients/clients.module'
import { ProductsModule } from './modules/products/products.module'
import { InventoryModule } from './modules/inventory/inventory.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { ReceivingModule } from './modules/receiving/receiving.module'
import { ShippingModule } from './modules/shipping/shipping.module'
import { ServiceModule } from './modules/service/service.module'
import { SettlementModule } from './modules/settlement/settlement.module'
import { TaxInvoiceModule } from './modules/tax-invoice/tax-invoice.module'
import { DocumentModule } from './modules/document/document.module'
import { AlertModule } from './modules/alert/alert.module'
import { LogModule } from './modules/log/log.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    PrismaModule,
    ClientsModule,
    ProductsModule,
    InventoryModule,
    DashboardModule,
    ReceivingModule,
    ShippingModule,
    ServiceModule,
    SettlementModule,
    TaxInvoiceModule,
    DocumentModule,
    AlertModule,
    LogModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: SupabaseAuthGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TenantMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
