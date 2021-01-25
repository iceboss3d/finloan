import { ApplicationEntity } from "src/application/application.entity";
import { CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('schedule')
export class ScheduleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @OneToOne(type => ApplicationEntity)
    application: ApplicationEntity;
}