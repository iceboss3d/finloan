import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/admin.entity';
import { CustomerController } from './customer.controller';
import { CustomerEntity } from './customer.entity';
import { CustomerService } from './customer.service';
import { CustomerDataEntity } from './customerData.entity';
import { CustomerEmploymentEntity } from './customerEmployment.entity';
import { CustomerPaymentEntity } from './customerPayment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity, CustomerEmploymentEntity, CustomerDataEntity, CustomerPaymentEntity, AdminEntity])],
  controllers: [CustomerController],
  providers: [CustomerService]
})
export class CustomerModule {}
