import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/loggin.interceptor';
import { HouseController } from './house/house.controller';
import { HouseModule } from './house/house.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
import { ApplicationController } from './application/application.controller';
import { ApplicationModule } from './application/application.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { InventoryController } from './inventory/inventory.controller';
import { InventoryModule } from './inventory/inventory.module';
import { GuarantorService } from './guarantor/guarantor.service';
import { LoanService } from './loan/loan.service';
import { LoanModule } from './loan/loan.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'files'),
    exclude: ['/api*'],
  }), AuthModule, TypeOrmModule.forRoot(), UserModule, HouseModule, AdminModule, CustomerModule, ApplicationModule, InventoryModule, LoanModule, ScheduleModule],
  controllers: [AppController, AuthController, HouseController, InventoryController],
  providers: [AppService, AuthService, {
    provide: APP_FILTER,
    useClass: HttpErrorFilter
  }, {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    }],
})
export class AppModule { }
