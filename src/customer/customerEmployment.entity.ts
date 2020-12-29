import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CustomerEntity } from "./customer.entity";
@Entity('customerEmployment')
export class CustomerEmploymentEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column()
    staffId: string;

    @Column()
    mda: string;

    @Column()
    gradeLevel: string;

    @Column()
    dateOfFirstAppointment: Date;

    @Column()
    retirementDate: Date;

    @OneToOne(type => CustomerEntity, customer => customer.employment)
    customer: CustomerEntity
}