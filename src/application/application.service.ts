import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAdmin } from 'src/admin/admin.dto';
import { IFile } from 'src/customer/customer.dto';
import { CustomerEntity } from 'src/customer/customer.entity';
import { GuarantorDTO } from 'src/guarantor/guarantor.dto';
import { GuarantorEntity } from 'src/guarantor/guarantor.entity';
import { apiResponse } from 'src/helpers/apiResponse';
import { Repository } from 'typeorm';
import { ApplicationDTO, TDocument } from './application.dto';
import { ApplicationEntity } from './application.entity';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(ApplicationEntity)
        private applicationRepository: Repository<ApplicationEntity>,
        @InjectRepository(GuarantorEntity)
        private guarantorRepository: Repository<GuarantorEntity>,
        @InjectRepository(CustomerEntity)
        private customerRepository: Repository<CustomerEntity>
    ) {}

    async newApplication(initiator: IAdmin, data: ApplicationDTO, customerId: string) {
        if(initiator.role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const customer = await this.customerRepository.findOne(customerId);
        if(!customer){
            return apiResponse.notFoundResponse('No customer found');
        }
        const application = this.applicationRepository.create({...data, initiator});
        await this.applicationRepository.save(application);

        return apiResponse.successResponseWithData("Application Created", application);
    }

    async updateApplication(id: string, user: IAdmin, data: Partial<ApplicationDTO>) {
        if(user.role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const application = await this.applicationRepository.findOne(id);
        if(!application){
            return apiResponse.notFoundResponse("Application not found");
        }
        await this.applicationRepository.update({id}, data);
        return apiResponse.successResponse('Application Updated');
    }

    async viewApplication(id: string, user: IAdmin) {
        if(user.role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const application = await this.applicationRepository.findOne(id);
        if(!application){
            return apiResponse.notFoundResponse('Application not Found')
        }
        return apiResponse.successResponseWithData("Application Fetched", application);
    }

    async viewApplications(user: IAdmin) {
        if(user.role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const applications = await this.applicationRepository.find();
        
        return apiResponse.successResponseWithData("Applications Fetched", applications);
    }

    async addGuarantor(id: string, user: IAdmin, data: GuarantorDTO) {
        if(user.role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const application = await this.applicationRepository.findOne(id);
        if(!application){
            return apiResponse.notFoundResponse('Application not Found');
        }
        const guarantor = this.guarantorRepository.create(data);
        await this.guarantorRepository.save(guarantor);
        await this.applicationRepository.update({id}, {guarantor});

        return apiResponse.successResponseWithData("Guarantor Added", guarantor);
    }

    async uploadDocument(id: string, user: IAdmin, file: IFile, document: TDocument) {
        if(user.role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const application = await this.applicationRepository.findOne(id);
        if(!application){
            return apiResponse.notFoundResponse('Application not Found');
        }
        await this.applicationRepository.update({id}, {[document]: file.filename});
        return apiResponse.successResponse(`${document} uploaded`);
    }
}
