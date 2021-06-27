import { application } from "express";
import { type } from "os";
import { IAdmin } from "src/admin/admin.dto";
import { AdminEntity } from "src/admin/admin.entity";
import { ApplicationEntity } from "src/application/application.entity";
import { ScheduleEntity } from "src/schedule/schedule.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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
    schedule: ScheduleEntity[];

    @Column({nullable: true, default: false})
    disburseStatus: boolean;

    @Column({nullable: true, default: false})
    status: boolean;

    @ManyToOne(type => AdminEntity)
    disbursedBy: AdminEntity;

    @ManyToOne(type => AdminEntity)
    approvedBy: AdminEntity;

    @OneToOne(type => ApplicationEntity, application => application.loan)
    application: ApplicationEntity;
}