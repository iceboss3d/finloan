import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/customer/customer.entity';
import { GuarantorEntity } from 'src/guarantor/guarantor.entity';
import { ApplicationController } from './application.controller';
import { ApplicationEntity } from './application.entity';
import { ApplicationService } from './application.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationEntity, GuarantorEntity, CustomerEntity])],
  controllers: [ApplicationController],
  providers: [ApplicationService]
})
export class ApplicationModule {}
