import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { IAdmin } from 'src/admin/admin.dto';
import { AuthGuard } from 'src/shared/ath.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { User } from 'src/user/user.decorator';
import { CustomerCreateDTO, CustomerDataDTO, CustomerEmploymentDTO, CustomerPaymentDTO, IFile } from './customer.dto';
import { CustomerService } from './customer.service';

@Controller('api/customer')
export class CustomerController {
    constructor(private customerService: CustomerService) { }

    @Get()
    @UseGuards(new AuthGuard())
    getAllCustomers(@User('role') user: string) {
        return this.customerService.listCustomers(user);
    }

    @Get(":id")
    @UseGuards(new AuthGuard())
    getCustomer(@User('role') user: string, @Param('id') id: string) {
        return this.customerService.getCustomerById(id);
    }

    @Post('create')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    createCustomer(@User() user: IAdmin, @Body() data: CustomerCreateDTO) {
        return this.customerService.createCustomer(user, data);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    updateCustomer(@User('role') user: string, @Body() data: Partial<CustomerCreateDTO>, @Param('id') id: string) {
        return this.customerService.updateCustomer(id, data);
    }

    @Post('data/:customerId')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    addCustomerData(@User('role') user: string, @Body() data: CustomerDataDTO, @Param("customerId") id: string) {
        return this.customerService.addCustomerData(id, user, data);
    }

    @Put('data/:id')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    updateCustomerData(@User('role') user: string, @Body() data: Partial<CustomerDataDTO>, @Param('id') id: string) {
        return this.customerService.updateCustomerData(id, user, data);
    }

    @Post('passport/:customerId')
    @UseGuards(new AuthGuard())
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './files/files',
            filename: (req, file, cb) => {                
                const fileNameSplit = file.originalname.split(".");
                const fileExt = fileNameSplit[fileNameSplit.length - 1];
                cb(null, `${Date.now()}.${fileExt}`);
            }
        })
    }))
    addCustomerPassport(@UploadedFile() file: IFile, @User('role') user: string, @Param('customerId') id: string) {
        return this.customerService.addCustomerPassport(id, user, file);
    }

    @Post('employment/:customerId')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    addCustomerEmployment(@User('role') user: string, @Body() data: CustomerEmploymentDTO, @Param("customerId") id: string) {
        return this.customerService.addCustomerEmployment(id, user, data);
    }

    @Put('employment/:id')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    updateCustomerEmployment(@User('role') user: string, @Body() data: Partial<CustomerEmploymentDTO>, @Param('id') id: string) {
        return this.customerService.updateCustomerEmployment(id, user, data);
    }

    @Post('payment/:customerId')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    addCustomerPayment(@User('role') user: string, @Body() data: CustomerPaymentDTO, @Param("customerId") id: string) {
        return this.customerService.addCustomerPayment(id, user, data);
    }

    @Put('payment/:id')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    updateCustomerPayment(@User('role') user: string, @Body() data: Partial<CustomerPaymentDTO>, @Param('id') id: string) {
        return this.customerService.updateCustomerPayment(id, user, data);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    deleteCustomer(@Param('id') id: string){
        return this.customerService.deleteCustomer(id);
    }
}
