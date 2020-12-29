import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAdmin } from 'src/admin/admin.dto';
import { AdminEntity } from 'src/admin/admin.entity';
import { apiResponse } from 'src/helpers/apiResponse';
import { Repository } from 'typeorm';
import { CustomerCreateDTO, CustomerDataDTO, CustomerEmploymentDTO, CustomerPaymentDTO } from './customer.dto';
import { CustomerEntity } from './customer.entity';
import { CustomerDataEntity } from './customerData.entity';
import { CustomerEmploymentEntity } from './customerEmployment.entity';
import { CustomerPaymentEntity } from './customerPayment.entity';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(CustomerEntity)
        private customerRepository: Repository<CustomerEntity>,
        @InjectRepository(CustomerDataEntity)
        private customerDataRepository: Repository<CustomerDataEntity>,
        @InjectRepository(CustomerEmploymentEntity)
        private customerEmploymentRepository: Repository<CustomerEmploymentEntity>,
        @InjectRepository(CustomerPaymentEntity)
        private customerPaymentRepository: Repository<CustomerPaymentEntity>,
        @InjectRepository(AdminEntity)
        private adminRepository: Repository<AdminEntity>,
    ) { }

    async listCustomers(userRole: string) {
        if (userRole === "customer") {
            return apiResponse.unauthorizedResponse("Only Admins can view customers");
        }
        const customers = await this.customerRepository.find({ relations: ['createdBy', 'data'] });
        return apiResponse.successResponseWithData("Successfully Fetched all Customers", customers);
    }

    async getCustomer(id: string, userRole: string) {
        if (userRole === "customer") {
            return apiResponse.unauthorizedResponse("Only Admins can view customers");
        }
        const customer = await this.customerRepository.findOne({ where: { id }, relations: ['createdBy'] });
        return apiResponse.successResponseWithData("Successfully Fetched Customer", customer);
    }

    async createCustomer(user: Partial<IAdmin>, data: CustomerCreateDTO) {
        if (user.role === "customer") {
            return apiResponse.unauthorizedResponse("Only Admins can Create Customers");
        }
        const customer = this.customerRepository.create({ ...data, createdBy: user });
        await this.customerRepository.save(customer);
        return apiResponse.successResponseWithData("Successfully Created Customer", customer);
    }

    async addCustomerData(id: string, role: string, data: CustomerDataDTO) {
        if (role === "customer") {
            return apiResponse.unauthorizedResponse("Only Admins can Update Customers Data");
        }
        const customer = await this.customerRepository.findOne({ where: { id } })
        const customerData = this.customerDataRepository.create({ ...data, customer });
        await this.customerDataRepository.save(customerData);
        return apiResponse.successResponseWithData("Successfully Created Customer", customerData);
    }

    async addCustomerEmployment(id: string, role: string, data: CustomerEmploymentDTO) {
        if (role === "customer") {
            return apiResponse.unauthorizedResponse("Only Admins can Update Customers Employment");
        }
        const customer = await this.customerRepository.findOne({ where: { id } })
        const customerEmployment = this.customerEmploymentRepository.create({ ...data, customer });
        await this.customerEmploymentRepository.save(customerEmployment);
        return apiResponse.successResponseWithData("Successfully Created Customer", customerEmployment);
    }

    async addCustomerPayment(id: string, role: string, data: CustomerPaymentDTO) {
        if (role === "customer") {
            return apiResponse.unauthorizedResponse("Only Admins can Update Customers Employment");
        }
        const customer = await this.customerRepository.findOne({ where: { id } })
        const customerPayment = this.customerPaymentRepository.create({ ...data, customer });
        await this.customerEmploymentRepository.save(customerPayment);
        return apiResponse.successResponseWithData("Successfully Created Customer", customerPayment);
    }
}
