import { AdminEntity } from "src/admin/admin.entity";
import { CustomerEntity } from "src/customer/customer.entity";
import { GuarantorEntity } from "src/guarantor/guarantor.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    category: string;

    @Column()
    tenure: number;

    @Column()
    interestRate: number;

    @Column({default: false, nullable: true})
    lineManagerApproval: boolean;

    @Column({nullable: true})
    lineManagerNote: string;

    @Column({default: false, nullable: true})
    managerApproval: boolean;

    @Column({nullable: true})
    managerNote: string;

    @ManyToOne(type => AdminEntity)
    @JoinColumn()
    lineManager: AdminEntity;

    @ManyToOne(type => AdminEntity)
    @JoinColumn()
    manager: AdminEntity;

    @Column({nullable: true})
    firstAppointmentLetter: string;

    @Column({nullable: true})
    confirmationLetter: string;

    @Column({nullable: true})
    lastPaySlip: string;

    @Column({nullable: true})
    verificationPrintout: string;

    @Column({nullable: true})
    letterOfIntroduction: string;

    @ManyToOne(type => CustomerEntity, customer => customer.applications, {cascade: true, eager: true})
    @JoinColumn()
    customer: CustomerEntity;

    @ManyToOne(type => GuarantorEntity, guarantor => guarantor.application, {cascade: true, eager: true})
    @JoinColumn()
    guarantor: GuarantorEntity;

    @ManyToOne(type => AdminEntity, {cascade: true, eager: true})
    @JoinColumn()
    initiator: AdminEntity;
}