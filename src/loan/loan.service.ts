import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { IAdmin } from 'src/admin/admin.dto';
import { ApplicationEntity } from 'src/application/application.entity';
import { IFile } from 'src/customer/customer.dto';
import { apiResponse } from 'src/helpers/apiResponse';
import { ScheduleService } from 'src/schedule/schedule.service';
import { getConnection, In, Repository } from 'typeorm';
import { LoanDTO } from './loan.dto';
import { LoanEntity } from './loan.entity';
import excelToJson = require('convert-excel-to-json');
import { ScheduleEntity } from 'src/schedule/schedule.entity';
@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(LoanEntity)
    private loanRepository: Repository<LoanEntity>,
    @InjectRepository(ScheduleEntity)
    private scheduleRepository: Repository<ScheduleEntity>,
    private readonly scheduleService: ScheduleService,
  ) {}

  async createLoan(
    loanData: LoanDTO,
    application: ApplicationEntity,
  ): Promise<LoanEntity> {
    const { approvedBy, commencementDate } = loanData;
    const { amount, interestRate, tenure } = application;
    const endDate = dayjs(commencementDate).add(application.tenure, 'month');
    const totalLoan = amount + ((interestRate * amount) / 100) * tenure;

    const loan = this.loanRepository.create({
      endDate,
      totalLoan,
      commencementDate,
      approvedBy,
      application,
    });

    await this.loanRepository.save(loan);
    await this.scheduleService.createSchedule(
      { tenure, totalLoan, commencementDate },
      loan,
    );
    return loan;
  }

  async disburseLoan(loanId: string, disbursedBy: IAdmin): Promise<void> {
    await this.loanRepository.update(loanId, {
      disburseStatus: true,
      disbursedBy,
    });
  }

  async getAllLoans(): Promise<HttpException> {
    const loans = await this.loanRepository.find({
      relations: ['application'],
    });
    return apiResponse.successResponseWithData('Loans Fetched', loans);
  }

  async getAllCompletedLoans(): Promise<HttpException> {
    const loans = await this.loanRepository.find({
      where: { status: true, disburseStatus: true },
      relations: ['application'],
    });
    return apiResponse.successResponseWithData('Loans Fetched', loans);
  }

  async getAllDisbursedLoans(): Promise<HttpException> {
    const loans = await this.loanRepository.find({
      where: { disburseStatus: true, status: false },
      relations: ['application'],
    });
    return apiResponse.successResponseWithData('Loans Fetched', loans);
  }

  async getLoanById(loanId: string): Promise<HttpException> {
    const loan = await this.loanRepository.findOne(loanId, {
      relations: ['application'],
    });
    if (!loan) {
      return apiResponse.notFoundResponse('No Loan Found');
    }
    return apiResponse.successResponseWithData('Loan Fetched', loan);
  }

  async batchUpload(loan: IFile) {
    const upload = excelToJson({
      sourceFile: loan.path,
      header: {
        rows: 1,
      },
      sheets: ['Sheet1'],
      columnToKey: {
        A: 'staffId',
        B: 'month',
        C: 'amount',
      },
    });

    const data: any = upload.Sheet1;
    console.log(data);

    data.forEach(async (element) => {
      console.log(element);
      
      await this.scheduleRepository.update(
        { staffId: element.staffId, month: element.month },
        { paymentStatus: true },
      );
    });

    return apiResponse.successResponseWithData('Data from upload', data);
  }
}
