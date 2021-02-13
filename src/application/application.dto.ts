import { IsNumber, IsString } from "class-validator";

export class ApplicationDTO {
    @IsNumber()
    amount: number;

    @IsString()
    category: TCategory;

    @IsNumber()
    tenure: number;

    @IsNumber()
    interestRate: number;
}

export type TDocument = "firstAppointmentLetter" | "confirmationLetter" | "lastPaySlip" | "verificationPrintout" | "letterOfIntroduction";

export type TCategory = "salary" | "politicalAppointment" | "other";