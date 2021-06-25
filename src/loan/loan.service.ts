import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { IAdmin } from 'src/admin/admin.dto';
import { ApplicationEntity } from 'src/application/application.entity';
import { ScheduleService } from 'src/schedule/schedule.service';
import { Repository } from 'typeorm';
import { LoanDTO } from './loan.dto';
import { LoanEntity } from './loan.entity';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(LoanEntity)
    private loanRepository: Repository<LoanEntity>,
    private readonly scheduleService: ScheduleService,
  ) {}

  async createLoan(loanData: LoanDTO, application: ApplicationEntity): Promise<LoanEntity> {
    
    const { approvedBy, commencementDate } = loanData;
    const { amount, interestRate, tenure } = application;
    const endDate = dayjs(commencementDate).add(application.tenure, 'month');
    const totalLoan = amount + ((interestRate * amount) / 100) * tenure;

    const loan = this.loanRepository.create({
      endDate,
      totalLoan,
      commencementDate,
      approvedBy,
      application
    });
    
    await this.loanRepository.save(loan);
    await this.scheduleService.createSchedule(
      { tenure, totalLoan, commencementDate },
      loan,
    );
    return loan;
  }

  async disburseLoan(loanId: string, disbursedBy: IAdmin): Promise<void> {
    
      await this.loanRepository.update(loanId, {disburseStatus: true, disbursedBy});
  }
}
