import { IsDateString, IsEmail, IsString } from "class-validator";

export class CustomerCreateDTO {
    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;

    middleName?: string;

    @IsString()
    phoneNumber!: string;

    @IsString()
    @IsEmail({}, {message: "Invalid Email"})
    email!: string;
}

export class CustomerDataDTO {
    dateOfBirth: Date;

    @IsString()
    gender: string;

    @IsString()
    maritalStatus: string;

    @IsString()
    hometown: string;

    @IsString()
    stateOfOrigin: string;

    @IsString()
    localGovernmentArea: string;

    @IsString()
    address: string;

    @IsString()
    city: string;

    @IsString()
    state: string;
}

export class CustomerEmploymentDTO {
    @IsString()
    staffId: string;

    @IsString()
    mda: string;

    @IsString()
    gradeLevel: string;

    dateOfFirstAppointment: Date;

    retirementDate: Date;
}

export class CustomerPaymentDTO {
    @IsString()
    bankName: string;

    @IsString()
    accountNumber: string;

    @IsString()
    sortCode: string;
}

export class PassportDTO {
    @IsString()
    passportUrl: string;
}