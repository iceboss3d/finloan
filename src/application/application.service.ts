import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import moment from 'moment';
import { IAdmin } from 'src/admin/admin.dto';
import { IFile } from 'src/customer/customer.dto';
import { CustomerEntity } from 'src/customer/customer.entity';
import { GuarantorDTO } from 'src/guarantor/guarantor.dto';
import { GuarantorEntity } from 'src/guarantor/guarantor.entity';
import { apiResponse } from 'src/helpers/apiResponse';
import { Utility } from 'src/helpers/utility';
import { LoanEntity } from 'src/loan/loan.entity';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { Repository } from 'typeorm';
import { ApplicationDTO, ApprovalDTO, TDocument } from './application.dto';
import { ApplicationEntity } from './application.entity';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(ApplicationEntity)
        private applicationRepository: Repository<ApplicationEntity>,
        @InjectRepository(GuarantorEntity)
        private guarantorRepository: Repository<GuarantorEntity>,
        @InjectRepository(LoanEntity)
        private loanRepository: Repository<LoanEntity>,
        @InjectRepository(ScheduleEntity)
        private scheduleRepository: Repository<ScheduleEntity>,
        @InjectRepository(CustomerEntity)
        private customerRepository: Repository<CustomerEntity>
    ) { }

    async newApplication(initiator: IAdmin, data: ApplicationDTO, customerId: string) {
        if (initiator.role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const customer = await this.customerRepository.findOne(customerId);
        if (!customer) {
            return apiResponse.notFoundResponse('No customer found');
        }
        const application = this.applicationRepository.create({ ...data, initiator, customer });
        await this.applicationRepository.save(application);

        return apiResponse.successResponseWithData("Application Created", application);
    }

    async updateApplication(id: string, user: IAdmin, data: Partial<ApplicationDTO>) {
        if (user.role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const application = await this.applicationRepository.findOne(id);
        if (!application) {
            return apiResponse.notFoundResponse("Application not found");
        }
        await this.applicationRepository.update({ id }, data);
        return apiResponse.successResponse('Application Updated');
    }

    async viewApplication(id: string, user: IAdmin) {
        if (user.role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const application = await this.applicationRepository.findOne(id);
        if (!application) {
            return apiResponse.notFoundResponse('Application not Found')
        }
        return apiResponse.successResponseWithData("Application Fetched", application);
    }

    async viewApplications(user: IAdmin) {
        if (user.role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const applications = await this.applicationRepository.find();

        return apiResponse.successResponseWithData("Applications Fetched", applications);
    }

    async addGuarantor(id: string, user: IAdmin, data: GuarantorDTO) {
        if (user.role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const application = await this.applicationRepository.findOne(id);
        if (!application) {
            return apiResponse.notFoundResponse('Application not Found');
        }
        const guarantor = this.guarantorRepository.create(data);
        await this.guarantorRepository.save(guarantor);
        await this.applicationRepository.update({ id }, { guarantor });

        return apiResponse.successResponseWithData("Guarantor Added", guarantor);
    }

    async uploadDocument(id: string, user: IAdmin, file: IFile, document: TDocument) {
        if (user.role === "customer") {
            return apiResponse.unauthorizedResponse("Unauthorised");
        }
        const application = await this.applicationRepository.findOne(id);
        if (!application) {
            return apiResponse.notFoundResponse('Application not Found');
        }
        await this.applicationRepository.update({ id }, { [document]: file.filename });
        return apiResponse.successResponse(`${document} uploaded`);
    }

    async lineManagerApproval(id: string, user: IAdmin, data: ApprovalDTO) {        
        if(user.role !== "lineManager"){
            return apiResponse.unauthorizedResponse("Only Line Managers are Allowed to perform this action");
        }
        const application = await this.applicationRepository.findOne(id);
        if(!application) {
            return apiResponse.notFoundResponse('Application not Found');
        }
        if(application.lineManagerApproval){
            return apiResponse.existingResponse("Loan already approved by a Line Manager");
        }
        await this.applicationRepository.update({id}, {lineManagerApproval: eval(data.status), lineManagerNote: data.note, lineManager: user});
        return apiResponse.successResponse('Loan Approval Updated');
    }
/**
 * A function for 2nd Approval and disbursal
 * @param id Application ID
 * @param user Authenticated User
 * @param data Approval DTO
 */
    async managerApproval(id: string, user: IAdmin, data: ApprovalDTO) {
        if(user.role !== "manager"){
            return apiResponse.unauthorizedResponse("Only Managers are Allowed to perform this action");
        }
        const application = await this.applicationRepository.findOne(id);
        if(!application) {
            return apiResponse.notFoundResponse('Application not Found');
        }
        if(application.managerApproval){
            return apiResponse.existingResponse("Loan already approved by a Manager");
        }
        if(!application.lineManagerApproval){
            return apiResponse.errorResponse("Loan needs to be approved by a Line Manager, before Manager Approval");
        }
        await this.applicationRepository.update({id}, {managerApproval: eval(data.status), managerNote: data.note, manager: user});
        // Return if !Approved
        if(!data.status) {
            return apiResponse.successResponse('Loan Approval Updated');
        }

        // Create Loan Instance and Save
        const loan = this.loanRepository.create({
            commencementDate: data.commencementDate,
            endDate: data.endDate,
            totalLoan: data.totalLoan,
            application
        })
        const savedLoan = await this.loanRepository.save(loan);

        for (let i = 0; i < data.schedule.length; i++) {
            const element = data.schedule[i];
            const presentSchedule = this.scheduleRepository.create({...element, loan: savedLoan})
            const savedSchedule = await this.scheduleRepository.save(presentSchedule);
            console.log(savedSchedule);
            
        }

        await this.applicationRepository.update({id}, {loan: savedLoan});

        return apiResponse.successResponse('Loan Approval Updated');
    }
}
