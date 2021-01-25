import { IsString } from "class-validator";

export class GuarantorDTO {
    @IsString()
    fullname: string;

    @IsString()
    placeOfWork: string;

    @IsString()
    designation: string;

    @IsString()
    phoneNumber: string;

    @IsString()
    address: string;
}