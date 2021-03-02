import { application } from "express";
import { ApplicationEntity } from "src/application/application.entity";
import { ScheduleEntity } from "src/schedule/schedule.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ISchedule } from "./loan.dto";

@Entity('loan')
export class LoanEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column()
    totalLoan: number;

    @Column()
    commencementDate: Date;

    @Column()
    endDate: Date;

    @OneToMany(type => ScheduleEntity, schedule => schedule.loan, {cascade: true, eager: true})
    @JoinColumn()
    schedule: ScheduleEntity[]

    @OneToOne(type => ApplicationEntity, application => application.loan)
    application: ApplicationEntity;
}