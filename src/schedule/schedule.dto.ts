import { IsDate, IsNumber } from "class-validator";

export class ScheduleDTO {
    @IsNumber()
    tenure: number;

    @IsNumber()
    totalLoan: number;

    @IsDate()
    commencementDate: Date;
}