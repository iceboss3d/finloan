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

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(), UserModule, HouseModule],
  controllers: [AppController, AuthController, HouseController],
  providers: [AppService, AuthService, {
    provide: APP_FILTER,
    useClass: HttpErrorFilter
  }, {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  }],
})
export class AppModule {}
