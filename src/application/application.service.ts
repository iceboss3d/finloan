import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAdmin } from 'src/admin/admin.dto';
import { ApprovalDTO } from 'src/approval/approval.dto';
import { ApprovalEntity, TApprovalStatus } from 'src/approval/approval.entity';
import { CustomerEntity } from 'src/customer/customer.entity';
import { GuarantorDTO } from 'src/guarantor/guarantor.dto';
import { GuarantorEntity } from 'src/guarantor/guarantor.entity';
import { apiResponse } from 'src/helpers/apiResponse';
import { Repository } from 'typeorm';
import { ApplicationDTO } from './application.dto';
import { ApplicationEntity } from './application.entity';

@Injectable()
export class ApplicationService {
    constructor(@InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    private guarantorRepository: Repository<GuarantorEntity>,
    private approvalRepository: Repository<ApprovalEntity>,
    private customerRepository: Repository<CustomerEntity>) { }

    async newApplication(data: ApplicationDTO, user: IAdmin) {
        const customer = await this.customerRepository.findOne(data.customer);
        if(!customer){
            return apiResponse.notFoundResponse("Customer not found");
        }
        const application = this.applicationRepository.create({
            ...data,
            customer,
            createdBy: user
        });

        await this.applicationRepository.save(application);
        return apiResponse.successResponseWithData("Application Created", application);
    }

    async editApplication(id: string, data: Partial<ApplicationDTO>, user: IAdmin) {
        if(user.role !== "super-admin"){
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const application = await this.applicationRepository.findOne({where: {id}});
        if(!application){
            return apiResponse.notFoundResponse("Application not Found");
        }
        const customer = await this.customerRepository.findOne(data.customer);
        if(!customer){
            return apiResponse.notFoundResponse("Customer not found");
        }
        await this.applicationRepository.update({id}, {
            ...data,
            customer
        });

        return apiResponse.successResponse("Application Updated");
    }

    async deleteApplication(id: string, user: IAdmin) {
        if(user.role !== "super-admin"){
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const application = await this.applicationRepository.findOne({where: {id}});
        if(!application){
            return apiResponse.notFoundResponse("Application not Found");
        }
        await this.applicationRepository.delete({id});

        return apiResponse.successResponse("Application Updated");
    }

    async viewApplications() {
        const applications = await this.applicationRepository.find();

        return apiResponse.successResponseWithData("Applications Fetched", applications);
    }

    async viewApplication(id: string) {
        const application = await this.applicationRepository.findOne({where: {id}});

        return apiResponse.successResponseWithData("Application Fetched", application);
    }

    async addFirstGuarantor(id: string, data: GuarantorDTO){
        const application = await this.applicationRepository.findOne({where: {id}});
        if(!application){
            return apiResponse.notFoundResponse("Application Not Found");
        }
        const firstGuarantor = this.guarantorRepository.create(data);
        await this.guarantorRepository.save(firstGuarantor);

        await this.applicationRepository.update({id}, {firstGuarantor});

        return apiResponse.successResponseWithData("First Guarantor Added", firstGuarantor);
    }

    async editFirstGuarantor(id: string, data: Partial<GuarantorDTO>, user: IAdmin){
        if(user.role !== 'super-admin'){
            return apiResponse.unauthorizedResponse('Unauthorised');
        }
        const firstGuarantor = await this.guarantorRepository.findOne({where: {id}});
        if(!firstGuarantor){
            return apiResponse.notFoundResponse('Guarantor not found');
        }
        await this.guarantorRepository.update({id}, {...data});

        return apiResponse.successResponse("First Guarantor Updated");
    }

    async addSecondGuarantor(id: string, data: GuarantorDTO){
        const application = await this.applicationRepository.findOne({where: {id}});
        if(!application){
            return apiResponse.notFoundResponse("Application Not Found");
        }
        const secondGuarantor = this.guarantorRepository.create(data);
        await this.guarantorRepository.save(secondGuarantor);

        await this.applicationRepository.update({id}, {secondGuarantor});

        return apiResponse.successResponseWithData("Second Guarantor Added", secondGuarantor);
    }

    async editSecondGuarantor(id: string, data: Partial<GuarantorDTO>, user: IAdmin){
        if(user.role !== 'super-admin'){
            return apiResponse.unauthorizedResponse('Unauthorised');
        }
        const secondGuarantor = await this.guarantorRepository.findOne({where: {id}});
        if(!secondGuarantor){
            return apiResponse.notFoundResponse('Guarantor not found');
        }
        await this.guarantorRepository.update({id}, {...data});

        return apiResponse.successResponse("Second Guarantor Updated");
    }

    async approveStepOne(id: string, user: IAdmin, data: ApprovalDTO){
        if(user.role !== "super-admin"){
            return apiResponse.unauthorizedResponse('Unauthorised');
        }
        const application = await this.applicationRepository.findOne({where: {id}});
        if(!application){
            return apiResponse.notFoundResponse('No application found');
        }
        const approval = this.approvalRepository.create({...data, admin: user});

        await this.approvalRepository.save(approval);

        await this.applicationRepository.update({id}, {firstApproval: approval});

        return apiResponse.successResponseWithData('Approved Step One', approval);
    }

    async approveStepTwo(id: string, user: IAdmin, data: ApprovalDTO){
        if(user.role !== "super-admin"){
            return apiResponse.unauthorizedResponse('Unauthorised');
        }
        const application = await this.applicationRepository.findOne({where: {id}});
        if(!application){
            return apiResponse.notFoundResponse('No application found');
        }

        if(application.firstApproval.admin === user){
            return apiResponse.unauthorizedResponse('You are not authorised to approve this application');
        }
        const approval = this.approvalRepository.create({status: data.status, admin: user});

        await this.approvalRepository.save(approval);

        await this.applicationRepository.update({id}, {secondApproval: approval});
        // Schedule

        return apiResponse.successResponseWithData('Approved Step Two', approval);
    }
}
