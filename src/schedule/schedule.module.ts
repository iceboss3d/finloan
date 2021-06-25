import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from './schedule.entity';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleEntity])],
  exports: [TypeOrmModule, ScheduleService],
  providers: [ScheduleService]
})
export class ScheduleModule {}
