import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAdmin } from 'src/admin/admin.dto';
import { IFile } from 'src/customer/customer.dto';
import { CustomerEntity } from 'src/customer/customer.entity';
import { GuarantorDTO } from 'src/guarantor/guarantor.dto';
import { GuarantorEntity } from 'src/guarantor/guarantor.entity';
import { apiResponse } from 'src/helpers/apiResponse';
import { LoanService } from 'src/loan/loan.service';
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
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
    private readonly loanService: LoanService,
  ) {}

  async newApplication(
    initiator: IAdmin,
    data: ApplicationDTO,
    customerId: string,
  ) {
    const customer = await this.customerRepository.findOne(customerId);
    if (!customer) {
      return apiResponse.notFoundResponse('No customer found');
    }
    const application = this.applicationRepository.create({
      ...data,
      initiator,
      customer,
    });
    await this.applicationRepository.save(application);

    return apiResponse.successResponseWithData(
      'Application Created',
      application,
    );
  }

  async updateApplication(id: string, data: Partial<ApplicationDTO>) {
    const application = await this.applicationRepository.findOne(id);
    if (!application) {
      return apiResponse.notFoundResponse('Application not found');
    }
    await this.applicationRepository.update({ id }, data);
    return apiResponse.successResponse('Application Updated');
  }

  async getApplicationById(id: string) {
    
    const application = await this.applicationRepository.findOne(id);
    
    return apiResponse.successResponseWithData("Application Retrieved", application);
  }

  async viewApplications() {
    const applications = await this.applicationRepository.find();

    return apiResponse.successResponseWithData(
      'Applications Fetched',
      applications,
    );
  }

  async addGuarantor(id: string, data: GuarantorDTO) {
    const application = await this.applicationRepository.findOne(id);
    if (!application) {
      return apiResponse.notFoundResponse('Application not Found');
    }
    const guarantor = this.guarantorRepository.create(data);
    await this.guarantorRepository.save(guarantor);
    await this.applicationRepository.update({ id }, { guarantor });

    return apiResponse.successResponseWithData('Guarantor Added', guarantor);
  }

  async uploadDocument(id: string, file: IFile, document: TDocument) {
    const application = await this.applicationRepository.findOne(id);
    if (!application) {
      return apiResponse.notFoundResponse('Application not Found');
    }
    await this.applicationRepository.update(
      { id },
      { [document]: file.filename },
    );
    return apiResponse.successResponse(`${document} uploaded`);
  }

  /**
   * A method for Line Manager Approval
   * @param id Application Id
   * @param adminUser Admin User of role lineManager
   * @param data Loan Approval Data
   * @returns
   */
  async lineManagerApproval(
    id: string,
    adminUser: IAdmin,
    data: ApprovalDTO,
  ): Promise<HttpException> {
    if (adminUser.role !== 'lineManager') {
      return apiResponse.unauthorizedResponse(
        'Only Line Managers are Allowed to perform this action',
      );
    }
    const application = await this.applicationRepository.findOne(id);
    if (!application) {
      return apiResponse.notFoundResponse('Application not Found');
    }

    if (application.lineManagerApproval) {
      return apiResponse.existingResponse(
        'Loan already approved by a Line Manager',
      );
    }
    await this.applicationRepository.update(
      { id },
      {
        lineManagerApproval: eval(data.status),
        lineManagerNote: data.note,
        lineManager: adminUser,
      },
    );

    // Return if Loan isn't Approved
    if (!data.status) {
      return apiResponse.successResponse('Loan Denied');
    }

    const loan = await this.loanService.createLoan(
      { commencementDate: data.commencementDate, approvedBy: adminUser },
      application,
    );
    
    await this.applicationRepository.update(id, { loan });
    
    return apiResponse.successResponse('Loan Approved');
  }

  /**
   * A function for 2nd Approval and disbursal
   * @param id Application ID
   * @param user Authenticated User
   * @param data Approval DTO
   */
  async managerApproval(
    id: string,
    adminUser: IAdmin,
    data: ApprovalDTO,
  ): Promise<HttpException> {
    if (adminUser.role !== 'manager') {
      return apiResponse.unauthorizedResponse(
        'Only Managers are Allowed to perform this action',
      );
    }
    const application = await this.applicationRepository.findOne(id);
    if (!application) {
      return apiResponse.notFoundResponse('Application not Found');
    }
    if (application.managerApproval) {
      return apiResponse.existingResponse('Loan already approved by a Manager');
    }
    if (!application.lineManagerApproval) {
      return apiResponse.errorResponse(
        'Loan needs to be approved by a Line Manager, before Manager Approval',
      );
    }

    await this.loanService.disburseLoan(application.loan.id, adminUser);

    await this.applicationRepository.update(
      { id },
      {
        managerApproval: eval(data.status),
        managerNote: data.note,
        manager: adminUser,
      },
    );
    // Return if !Approved
    if (!data.status) {
      return apiResponse.successResponse('Loan Denied');
    }

    return apiResponse.successResponse('Loan Approved');
  }
}
