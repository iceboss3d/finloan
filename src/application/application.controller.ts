import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IAdmin } from 'src/admin/admin.dto';
import { IFile } from 'src/customer/customer.dto';
import { GuarantorDTO } from 'src/guarantor/guarantor.dto';
import { AuthGuard } from 'src/shared/ath.guard';
import { User } from 'src/user/user.decorator';
import { ApplicationDTO, ApprovalDTO, TDocument } from './application.dto';
import { ApplicationService } from './application.service';

@Controller('api/application')
export class ApplicationController {
    constructor(private applicationService: ApplicationService) { }

    @Post('new/:id')
    @UseGuards(new AuthGuard())
    newApplication(@User() user: IAdmin, @Body() data: ApplicationDTO, @Param('id') customer: string) {
        return this.applicationService.newApplication(user, data, customer);
    }

    @Put('update/:id')
    @UseGuards(new AuthGuard())
    updateApplication(@User() user: IAdmin, data: Partial<ApplicationDTO>, @Param('id') id: string) {
        return this.applicationService.updateApplication(id, user, data);
    }

    @Get('view-all')
    @UseGuards(new AuthGuard())
    viewApplications(@User() user: IAdmin) {
        return this.applicationService.viewApplications(user);
    }

    @Get('view/:id')
    @UseGuards(new AuthGuard())
    viewApplication(@User() user: IAdmin, @Param('id') id: string) {
        return this.applicationService.viewApplication(id, user);
    }

    @Post(':id/add-guarantor')
    @UseGuards(new AuthGuard())
    addGuarantor(@User() user: IAdmin, @Param('id') id: string, @Body() data: GuarantorDTO) {
        return this.applicationService.addGuarantor(id, user, data)
    }

    @Post(':id/upload-document')
    @UseGuards(new AuthGuard())
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: `./files/documents`,
            filename: (req, file, cb) => {
                const fileNameSplit = file.originalname.split(".");
                const fileExt = fileNameSplit[fileNameSplit.length - 1];
                cb(null, `${req.query.document}-${Date.now()}.${fileExt}`);
            }
        })
    }))
    uploadDocument(@User() user: IAdmin, @Param('id') id: string, @Query('document') document: TDocument, @UploadedFile() file: IFile) {
        return this.applicationService.uploadDocument(id, user, file, document);
    }

    @Post(':id/lineManager')
    @UseGuards(new AuthGuard())
    lineManagerApproval(@User() user: IAdmin, @Param('id') id: string, @Body() document: ApprovalDTO){
        return this.applicationService.lineManagerApproval(id, user, document);
    }

    @Post(':id/manager') 
    @UseGuards(new AuthGuard())
    managerApproval(@User() user: IAdmin, @Param('id') id: string, @Body() document: ApprovalDTO){
        console.log(document);
        
        return this.applicationService.managerApproval(id, user, document);
    }
}
