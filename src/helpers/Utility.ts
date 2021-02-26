import moment from "moment";
import { ISchedule } from "src/loan/loan.dto";

export class Utility {
    /**
     * A Utility method that returns a random number as a string
     * @param length 
     * @returns string
     */
    randomNumber = (length: number): string => {
        let text: string = "";
        const possible = "123456789";
        for (let i = 0; i < length; i++) {
            let sup: number = Math.floor(Math.random() * possible.length);
            text += i > 0 && sup == i ? "0" : possible.charAt(sup);
        }
        return text;
    };

    /**
     * A Utility method that prepares the loan schedule
     * @param tenure Loan Duration
     * @param amount Total Loan Amount
     * @param commencementDate Begining Date
     * 
     * @returns schedule
     */
    prepareSchedule = (tenure: number, amount: number, commencementDate: Date): ISchedule[] => {
        const monthlyPayment = amount / tenure;
        let count = 1;
        const schedule = []
        for (let i = 1; count !== tenure; i++) {
            schedule.push({
                paymentStatus: false,
                amount: monthlyPayment,
                month: moment(commencementDate).add(count).format('MMMM')
            })
            count += 1;
        }
        return schedule
    }
}