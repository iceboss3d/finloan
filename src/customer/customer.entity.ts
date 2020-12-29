import { AdminEntity } from "src/admin/admin.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CustomerDataEntity } from "./customerData.entity";
import { CustomerEmploymentEntity } from "./customerEmployment.entity";
import { CustomerPaymentEntity } from "./customerPayment.entity";

@Entity('customer')
export class CustomerEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({nullable: true})
    middleName: string;

    @Column()
    phoneNumber: string;

    @Column()
    email: string;

    @OneToOne(type => CustomerDataEntity, data => data.customer)
    @JoinColumn()
    data: CustomerDataEntity;

    @OneToOne(type => CustomerEmploymentEntity, employment => employment.customer)
    @JoinColumn()
    employment: CustomerEmploymentEntity;

    @OneToOne(type => CustomerPaymentEntity, payment => payment.customer)
    @JoinColumn()
    payment: CustomerPaymentEntity;

    @ManyToOne(type => AdminEntity, createdBy => createdBy.customers)
    createdBy: AdminEntity;
}