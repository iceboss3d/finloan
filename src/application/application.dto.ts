import { IsNumber, IsString } from "class-validator";
import { TCategory } from "./application.entity";

export class ApplicationDTO {
    @IsNumber()
    amount: number;

    @IsString()
    category: TCategory;

    @IsNumber()
    tenure: number;

    @IsNumber()
    interestRate: number;

    @IsString()
    customer: string;
}