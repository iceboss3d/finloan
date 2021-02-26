import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    @Column('simple-array')
    schedule: ISchedule[]
}