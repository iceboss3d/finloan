import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { IAdmin } from 'src/admin/admin.dto';
import { AuthGuard } from 'src/shared/ath.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { User } from 'src/user/user.decorator';
import { CustomerCreateDTO, CustomerDataDTO, CustomerEmploymentDTO, CustomerPaymentDTO } from './customer.dto';
import { CustomerService } from './customer.service';

@Controller('api/customer')
export class CustomerController {
    constructor(private customerService: CustomerService) {}

    @Get()
    @UseGuards(new AuthGuard())
    getAllCustomers(@User('role') user: string){
        return this.customerService.listCustomers(user);
    }

    @Get(":id")
    @UseGuards(new AuthGuard())
    getCustomer(@User('role') user: string, @Param('id') id: string){
        return this.customerService.getCustomer(id, user);
    }

    @Post('create')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    createCustomer(@User() user: Partial<IAdmin>, @Body() data: CustomerCreateDTO){
        return this.customerService.createCustomer(user, data);
    }

    @Post('data/:customerId')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    addCustomerData(@User('role') user: string, @Body() data: CustomerDataDTO, @Param("customerId") id: string){
        return this.customerService.addCustomerData(id, user, data);
    }

    @Post('employment/:customerId')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    addCustomerEmployment(@User('role') user: string, @Body() data: CustomerEmploymentDTO, @Param("customerId") id: string){
        return this.customerService.addCustomerEmployment(id, user, data);
    }

    @Post('payment/:customerId')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    addCustomerPayment(@User('role') user: string, @Body() data: CustomerPaymentDTO, @Param("customerId") id: string){
        return this.customerService.addCustomerPayment(id, user, data);
    }

}
