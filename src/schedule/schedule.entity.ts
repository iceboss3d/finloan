import { LoanEntity } from "src/loan/loan.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('schedule')
export class ScheduleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @ManyToOne(type => LoanEntity, loan => loan.schedule)
    loan: LoanEntity;

    @Column()
    paymentStatus: boolean;

    @Column()
    amount: number;

    @Column()
    day: number;

    @Column()
    month: string;

    @Column()
    year: string;
}