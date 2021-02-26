import { IsDate } from "class-validator";

export class LoanDTO {
    @IsDate()
    commencementDate: Date;
}

export interface ISchedule {
    paymentStatus: boolean;
    amount: number;
    month: string;
}