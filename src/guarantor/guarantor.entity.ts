import { ApplicationEntity } from "src/application/application.entity";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('guarantor')
export class GuarantorEntity {
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

    @Column()
    placeOfWork: string;

    @Column()
    designation: string;

    @Column()
    phoneNumber: string;

    @Column()
    address: string;

    @OneToOne(type => ApplicationEntity, application => application.guarantor)
    application: ApplicationEntity;
}