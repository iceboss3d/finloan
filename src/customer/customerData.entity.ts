import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CustomerEntity } from "./customer.entity";

@Entity('customerData')
export class CustomerDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
    
    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column()
    dateOfBirth: Date;

    @Column()
    gender: string;

    @Column()
    maritalStatus: string;

    @Column()
    hometown: string;

    @Column()
    stateOfOrigin: string;

    @Column()
    localGovernmentArea: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @OneToOne(type => CustomerEntity, customer => customer.data)
    customer: CustomerEntity;
}