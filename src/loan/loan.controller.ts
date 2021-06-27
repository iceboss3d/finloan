import { Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IFile } from 'src/customer/customer.dto';
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

    @Post("/batch-upload")
    @UseGuards(new AuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: "./files/payments",
            filename: (req, file, cb) => {
                const fileNameSplit = file.originalname.split(".");
                const fileExt = fileNameSplit[fileNameSplit.length - 1];
                cb(null, `${fileNameSplit[0]}-${Date.now()}.${fileExt}`);
            }
        })
    }))
    batchUpload(@UploadedFile() file: IFile){
        return this.loanService.batchUpload(file);
    }

    @Get(":loanId")
    @UseGuards(new AuthGuard)
    getLoanById(@Param("loanId") loanId: string){
        return this.loanService.getLoanById(loanId);
    }
}
