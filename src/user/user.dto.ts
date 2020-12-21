import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class UserDTO {
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

    isConfirmed: boolean;

    status: boolean;

    otpTries: number;

    confirmOtp: string;
}

export class OtpDTO {
    @IsString()
    @IsNotEmpty({message: "Email is Required"})
    @IsEmail({}, {message: "Invalid Email"})
    email!: string;

    @IsString()
    @IsNotEmpty({message: "OTP is Required"})
    @Length(6, 6, {message: "OTP must be not less than 6 Characters"})
    confirmOtp!: string;
}

export class PasswordResetDTO {
    @IsString()
    @IsNotEmpty({message: "Email is Required"})
    @IsEmail({}, {message: "Invalid Email"})
    email!: string;

    @IsString()
    @IsNotEmpty({message: "Token is Required"})
    @Length(6, 6, {message: "Token must be not less than 6 Characters"})
    passwordResetToken!: string;

    @IsString()
    @IsNotEmpty({message: "Password is Required"})
    @Length(6, 30, {message: "Password must be not less than 6 and not more than 30 Characters"})
    password!: string;
}

export class LoginDTO {
    @IsString()
    @IsEmail({}, {message: "Invalid Email"})
    @IsNotEmpty({message: "Email is Required"})
    email!: string;

    @IsString()
    @IsNotEmpty({message: "Password is Required"})
    @Length(6, 30, {message: "Password must be not less than 6 and not more than 30 Characters"})
    password!: string;
}

export class EmailDTO {
    @IsString()
    @IsEmail({}, {message: "Invalid Email"})
    @IsNotEmpty({message: "Email is Required"})
    email!: string;
}