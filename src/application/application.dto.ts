import { IsBoolean, IsNumber, IsString } from "class-validator";
import { ISchedule } from "src/loan/loan.dto";

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

export class ApprovalDTO {
    @IsBoolean()
    status: "true" | "false";

    note?: string;

    commencementDate?: Date;
}

export type TDocument = "firstAppointmentLetter" | "confirmationLetter" | "lastPaySlip" | "verificationPrintout" | "letterOfIntroduction";

export type TCategory = "salary" | "politicalAppointment" | "other";