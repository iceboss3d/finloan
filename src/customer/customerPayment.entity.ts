import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CustomerEntity } from "./customer.entity";

@Entity('customerBankAccount')
export class CustomerPaymentEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column()
    bankName: string;

    @Column()
    accountNumber: string;

    @Column()
    sortCode: string;

    @OneToOne(type => CustomerEntity, customer => customer.payment)
    customer: CustomerEntity
}