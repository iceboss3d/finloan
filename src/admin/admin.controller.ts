import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AdminActivateDTO, AdminCreateDTO, AdminLoginDTO } from './admin.dto';
import { AdminService } from './admin.service';

@Controller('api/admin/auth')
export class AdminController {
    constructor(private adminService: AdminService) {}
    
    @Post('create')
    @UsePipes(new ValidationPipe())
    createAdmin(@Body() data: AdminCreateDTO){
        return this.adminService.createAdmin(data)
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    loginAdmin(@Body() data: AdminLoginDTO){
        return this.adminService.loginAdmin(data)
    }

    @Post('activate')
    @UsePipes(new ValidationPipe())
    activateAdmin(@Body() data: AdminActivateDTO){
        return this.adminService.activateAccount(data)
    }
}
