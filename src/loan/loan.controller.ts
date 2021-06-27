import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/ath.guard';
import { LoanService } from './loan.service';

@Controller('api/loan')
export class LoanController {
    constructor(private loanService: LoanService){ }
    
    @Get()
    @UseGuards(new AuthGuard)
    getAllLoans(){
        return this.loanService.getAllLoans();
    }
    
    @Get("/disbursed")
    @UseGuards(new AuthGuard)
    getAllDisbursedLoans(){
        return this.loanService.getAllDisbursedLoans();
    }
    
    @Get("/completed")
    @UseGuards(new AuthGuard)
    getAllCompleted(){
        return this.loanService.getAllCompletedLoans();
    }

    @Get(":loanId")
    @UseGuards(new AuthGuard)
    getLoanById(@Param("loanId") loanId: string){
        return this.loanService.getLoanById(loanId);
    }
}
