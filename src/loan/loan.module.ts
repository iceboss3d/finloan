import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { ScheduleService } from 'src/schedule/schedule.service';
import { LoanEntity } from './loan.entity';
import { LoanService } from './loan.service';

@Module({
    imports: [TypeOrmModule.forFeature([LoanEntity, ScheduleEntity])],
    exports: [TypeOrmModule, LoanService],
    providers: [LoanService, ScheduleService]
})
export class LoanModule {}
