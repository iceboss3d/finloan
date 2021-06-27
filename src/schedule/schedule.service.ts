import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { LoanEntity } from 'src/loan/loan.entity';
import { Repository } from 'typeorm';
import { ScheduleDTO } from './schedule.dto';
import { ScheduleEntity } from './schedule.entity';

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(ScheduleEntity)
        private scheduleRepository: Repository<ScheduleEntity>
    ){}

    async createSchedule(schedule: ScheduleDTO, loan: LoanEntity){
        const monthlyPayment: number = Math.round(schedule.totalLoan / schedule.tenure);
        for (let index = 1; index <= schedule.tenure; index++) {
            const presentSchedule = this.scheduleRepository.create({
                paymentStatus: false,
                amount: monthlyPayment,
                day: parseInt(dayjs(schedule.commencementDate).add(index, 'month').format('D')),
                month: dayjs(schedule.commencementDate).add(index, 'month').format('MMMM'),
                year: (dayjs(schedule.commencementDate).add(index, 'month').format('YYYY')),
                loan,
                staffId: loan.application.customer.employment.staffId
            });
            await this.scheduleRepository.save(presentSchedule);
        }
    }
}
