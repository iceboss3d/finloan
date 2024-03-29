import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAdmin } from 'src/admin/admin.dto';
import { AdminEntity } from 'src/admin/admin.entity';
import { apiResponse } from 'src/helpers/apiResponse';
import { Repository } from 'typeorm';
import { CustomerCreateDTO, CustomerDataDTO, CustomerEmploymentDTO, CustomerPaymentDTO, IFile } from './customer.dto';
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
        const customers = await this.customerRepository.find();
        return apiResponse.successResponseWithData("Successfully Fetched all Customers", customers);
    }

    async getCustomerById(id: string) {
        const customer = await this.customerRepository.findOne(id);
        return apiResponse.successResponseWithData("Customer Fetched", customer);
    }

    async getCustomerByEmail(email: string) {
        const customer = await this.customerRepository.findOne({where: {email}});
        return apiResponse.successResponseWithData("Customer fetched", customer);
    }

    async createCustomer(user: IAdmin, data: CustomerCreateDTO) {
        const customer = await this.customerRepository.findOne({ where: {email: data.email}});
        
        if(customer){
            return apiResponse.existingResponse("Customer with such email already exists");
        }
        const newCustomer = this.customerRepository.create({ ...data, createdBy: user });
        await this.customerRepository.save(newCustomer);
        return apiResponse.successResponseWithData("Successfully Created Customer", newCustomer);
    }

    async updateCustomer(id: string, data: Partial<CustomerCreateDTO>) {
        const customer = await this.customerRepository.findOne(id);
        if (!customer) {
            return apiResponse.notFoundResponse("Customer not found");
        }
        const updatedCustomer = await this.customerRepository.update({id}, data);
        return apiResponse.successResponseWithData("Customer updated", updatedCustomer);
    }

    async addCustomerData(id: string, role: string, data: Partial<CustomerDataDTO>) {
        if (role === "customer") {
            return apiResponse.unauthorizedResponse("Only Admins can Update Customers Data");
        }
        const customer = await this.customerRepository.findOne({ where: { id } })
        const customerData = this.customerDataRepository.create({ ...data, customer });
        await this.customerDataRepository.save(customerData);
        return apiResponse.successResponseWithData("Successfully Created Customer", customerData);
    }
    
    async updateCustomerData(id: string, role: string, data: Partial<CustomerDataDTO>) {
        if(role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const customer = await this.customerRepository.findOne({where: {id}});
        if (!customer) {
            return apiResponse.notFoundResponse("Customer not found");
        }
        await this.customerDataRepository.update({id: customer.data.id}, data);
        return apiResponse.successResponse("Customer Data Updated");
    }

    async addCustomerPassport(id: string, role: string, data: IFile) {
        if (role === "customer") {
            return apiResponse.unauthorizedResponse("Only Admins can Update Customers Data");
        }
        const customer = await this.customerRepository.findOne({ where: { id } });
        if (!customer) {
            return apiResponse.notFoundResponse("Customer not found");
        }
        const passportUrl = data.filename;
        
        await this.customerDataRepository.update({ id: customer.data.id }, { passportUrl });
        return apiResponse.successResponseWithData('Passport Uploaded', { passportUrl });
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
    
    async updateCustomerEmployment(id: string, role: string, data: Partial<CustomerEmploymentDTO>) {
        if(role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const customer = await this.customerRepository.findOne({where: {id}});
        if (!customer) {
            return apiResponse.notFoundResponse("Customer not found");
        }
        await this.customerEmploymentRepository.update({id: customer.data.id}, data);
        return apiResponse.successResponse("Customer Employment Updated");
    }

    async addCustomerPayment(id: string, role: string, data: CustomerPaymentDTO) {
        if (role === "customer") {
            return apiResponse.unauthorizedResponse("Only Admins can Update Customers Employment");
        }
        const customer = await this.customerRepository.findOne({ where: { id } });
        const customerPayment = this.customerPaymentRepository.create({ ...data, customer });
        await this.customerPaymentRepository.save(customerPayment);
        return apiResponse.successResponseWithData("Successfully Created Customer", customerPayment);
    }
    
    async updateCustomerPayment(id: string, role: string, data: Partial<CustomerPaymentDTO>) {
        if(role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const customer = await this.customerRepository.findOne({where: {id}});
        if (!customer) {
            return apiResponse.notFoundResponse("Customer not found");
        }
        await this.customerPaymentRepository.update({id: customer.data.id}, data);
        return apiResponse.successResponse("Customer Payment Updated");
    }

    async deleteCustomer(id: string){
        const customer = await this.customerRepository.findOne(id);
        if(!customer){
            return apiResponse.notFoundResponse("Customer not found");
        }
        await this.customerRepository.delete(id);
        return apiResponse.successResponse("Customer Delete Success");
    }
}
