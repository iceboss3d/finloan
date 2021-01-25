import { IAdmin } from "src/admin/admin.dto";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('approval')
export class ApprovalEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column()
    admin: IAdmin;

    @Column({default: "pending"})
    status: TApprovalStatus;
}

export type TApprovalStatus = "approved" | "denied" | "keep-in-view" | "pending";