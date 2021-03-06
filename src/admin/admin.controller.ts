import { Body, Controller, Post, UseGuards, UsePipes, Get } from '@nestjs/common';
import { AuthGuard } from 'src/shared/ath.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { User } from 'src/user/user.decorator';
import { Admin } from './admin.decorator';
import { AdminActivateDTO, AdminCreateDTO, AdminLoginDTO, IAdmin } from './admin.dto';
import { AdminService } from './admin.service';


@Controller('api/admin/auth')
export class AdminController {
    constructor(private adminService: AdminService) {}
    
    @Post('create')
    @UsePipes(new ValidationPipe())
    @UseGuards(new AuthGuard())
    createAdmin(@Body() data: AdminCreateDTO, @Admin() admin: IAdmin){
        return this.adminService.createAdmin(data, admin)
    }

    @Get()
    @UseGuards(new AuthGuard())
    listAdmin(@Admin() admin: IAdmin){
        return this.adminService.listAdmin(admin);
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
