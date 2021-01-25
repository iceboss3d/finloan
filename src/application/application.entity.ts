import { AdminEntity } from "src/admin/admin.entity";
import { ApprovalEntity } from "src/approval/approval.entity";
import { CustomerEntity } from "src/customer/customer.entity";
import { GuarantorEntity } from "src/guarantor/guarantor.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('application')
export class ApplicationEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column()
    amount: number;

    @Column()
    category: TCategory;

    @Column()
    tenure: number;

    @Column()
    interestRate: number;

    @OneToOne(type => ApprovalEntity)
    firstApproval: ApprovalEntity;

    @OneToOne(type => ApprovalEntity)
    secondApproval: ApprovalEntity;

    @ManyToOne(type => CustomerEntity)
    customer: CustomerEntity;

    @ManyToOne(type => AdminEntity)
    createdBy: AdminEntity;

    @OneToOne(type => GuarantorEntity)
    firstGuarantor: GuarantorEntity;

    @OneToOne(type => GuarantorEntity)
    secondGuarantor: GuarantorEntity;
}

export type TCategory = "civilServant" | "political" | "others";