import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    interestRate: string;
}