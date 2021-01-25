import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("guarantor")
export class GuarantorEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column()
    fullname: string;

    @Column()
    placeOfWork: string;

    @Column()
    designation: string;

    @Column()
    phoneNumber: string;

    @Column()
    address: string;
}