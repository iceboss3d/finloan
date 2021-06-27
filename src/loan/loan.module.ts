import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from 'src/schedule/schedule.entity';
import { ScheduleService } from 'src/schedule/schedule.service';
import { LoanEntity } from './loan.entity';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';

@Module({
    imports: [TypeOrmModule.forFeature([LoanEntity, ScheduleEntity])],
    exports: [TypeOrmModule, LoanService],
    providers: [LoanService, ScheduleService],
    controllers: [LoanController]
})
export class LoanModule {}
