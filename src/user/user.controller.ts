import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from 'src/shared/ath.guard';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { User } from './user.decorator';
import { EmailDTO, LoginDTO, OtpDTO, PasswordResetDTO, UserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('api/auth')
export class UserController {
    constructor(private userService: UserService) { }
    @Get('users')
    @UseGuards(new AuthGuard())
    getUsers(@User() user) {
        console.log(user);
        
        return this.userService.getUsers();
    }

    @Get('users/:id')
    getUser(@Param('id') id: string) {
        return this.userService.getUser(id);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() data: UserDTO) {
        return this.userService.register(data)
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: LoginDTO) {
        return this.userService.login(data)
    }

    @Post('verify-otp')
    @UsePipes(new ValidationPipe())
    verifyOtp(@Body() data: OtpDTO) {
        return this.userService.verifyOtp(data)
    }

    @Post('resend-otp')
    @UsePipes(new ValidationPipe())
    resendOtp(@Body() data: EmailDTO) {
        return this.userService.resendOtp(data)
    }

    @Post('password-reset')
    @UsePipes(new ValidationPipe())
    passwordReset(@Body() data: EmailDTO) {
        return this.userService.resetPassword(data)
    }

    @Post('new-password')
    @UsePipes(new ValidationPipe())
    newPassword(@Body() data: PasswordResetDTO) {
        return this.userService.newPassword(data)
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

}
