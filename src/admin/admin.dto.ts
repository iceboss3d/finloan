import { IsEmail, IsNumber, IsString, Length } from "class-validator";
import { TRole } from "./admin.entity";

export class AdminCreateDTO {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    @IsEmail({}, {message: 'Invalid Email'})
    email: string;

    @IsString()
    password: string;

    @IsString()
    phoneNumber: string;

    @IsString()
    role: string;
}

export class AdminLoginDTO {
    @IsString()
    @IsEmail({}, {message: 'Invalid Email'})
    email: string;

    @IsString()
    password: string;
}

export class AdminActivateDTO {
    @IsString()
    @IsEmail({}, {message: 'Invalid Email'})
    email!: string;

    @IsString()
    password!: string;

    @IsString()
    @Length(6, 6, {message: 'Token length must be 6 characters'})
    passwordResetToken!: string
}

export interface IAdmin {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    status: boolean;
    iat: number;
    exp: number;
}