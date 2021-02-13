import { AdminEntity } from "src/admin/admin.entity";
import { ApplicationEntity } from "src/application/application.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    @OneToOne(type => CustomerDataEntity, data => data.customer, {cascade: true, eager: true})
    @JoinColumn()
    data: CustomerDataEntity;

    @OneToOne(type => CustomerEmploymentEntity, employment => employment.customer, {cascade: true, eager: true})
    @JoinColumn()
    employment: CustomerEmploymentEntity;

    @OneToOne(type => CustomerPaymentEntity, payment => payment.customer, {cascade: true, eager: true})
    @JoinColumn()
    payment: CustomerPaymentEntity;

    @ManyToOne(type => AdminEntity, createdBy => createdBy.customers, {cascade: true, eager: true})
    createdBy: AdminEntity;

    @OneToMany(type => ApplicationEntity, application => application.customer)
    applications: ApplicationEntity[]
}