import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { CustomerEntity } from "src/customer/customer.entity";

@Entity('admin')
export class AdminEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column()
    @Length(2, 30, {message: 'First Name must be at least 2 but not larger than 30 characters'})
    @IsNotEmpty({message: 'First Name is required'})
    firstName!: string;

    @Column()
    @Length(2, 30, {message: 'Last Name must be at least 2 but not larger than 30 characters'})
    @IsNotEmpty({message: 'Last Name is required'})
    lastName!: string;

    @Column({ unique: true })
    @IsEmail({}, { message: 'Invalid Email' })
    @IsNotEmpty({ message: 'Password is required' })
    email!: string;

    @Column()
    @Length(11, 11, { message: 'Phone Number must be 11 characters' })
    @IsNotEmpty({ message: 'Phone Number is required' })
    phoneNumber!: string;

    @Column()
    @Length(6, 30, { message: 'Password must be at least 6 but not longer than 30 characters' })
    @IsNotEmpty({ message: 'Password is required' })
    password!: string;

    @Column()
    @IsNotEmpty({message: 'Admin Role is Required'})
    role!: string;

    @Column({nullable: true})
    passwordResetToken: string;

    @Column({type: "boolean"})
    status: boolean;

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 10);
        this.status = false;
    }

    @OneToMany(type => CustomerEntity, customer => customer.createdBy)
    customers: CustomerEntity[]

    toResponseObject(){
        const {id, firstName, lastName, email, phoneNumber, role, status} = this;
        return {id, firstName, lastName, email, phoneNumber, role, status}
    }
}