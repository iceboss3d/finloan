import { IsDate, IsNumber } from "class-validator";
import { IAdmin } from "src/admin/admin.dto";

export class LoanDTO {
    @IsDate()
    commencementDate: Date;

    approvedBy: IAdmin;
}

export interface ISchedule {
    paymentStatus: boolean;
    amount: number;
    day: number;
    month: string;
    year: string;
}