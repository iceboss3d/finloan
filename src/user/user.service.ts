import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { LoginDTO, OtpDTO, UserDTO, PasswordResetDTO, EmailDTO } from './user.dto';
import { apiResponse } from 'src/helpers/apiResponse';
import { Utility } from 'src/helpers/utility';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { mailer } from 'src/helpers/Mailer';
import { constants } from 'src/helpers/constants';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { }

    async getUsers() {
        const users = await this.userRepository.find();
        if (users.length < 1) {
            return apiResponse.notFoundResponse('No Users Found');
        }
        return apiResponse.successResponseWithData('Users Fetched', users);
    }

    async getUser(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            return apiResponse.notFoundResponse('No User Found');
        }
        return apiResponse.successResponseWithData('User Fetched', user.toResponseObject());
    }

    async register(data: UserDTO) {
        const confirmOtp = new Utility().randomNumber(6);
        const { firstName, lastName, email, phoneNumber, password } = data;
        const user = this.userRepository.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            confirmOtp
        });
        const from = { email: constants.confirmEmails.from, name: constants.confirmEmails.from };
        const personalization = [{
            to: [
                { email: user.email, name: user.firstName }
            ]
        }];
        const dynamicTemplateData = {
            otp: confirmOtp,
            firstName,
        };
        const templateId = "d-f5198ee6ad3542a7944748f7d280d9a1";
        const result = await mailer.send(from, personalization, dynamicTemplateData, templateId);
        console.log(result);

        const savedUser = await this.userRepository.save(user);
        if (!savedUser) {
            return apiResponse.errorResponse("Unable to Register User");
        }
        return apiResponse.successResponseWithData("Registration Successful", savedUser.toResponseObject());
    }

    async verifyOtp(data: OtpDTO) {
        const { email, confirmOtp } = data;
        let user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return apiResponse.notFoundResponse('No User Found');
        }
        if (user.isConfirmed && user.status) {
            return apiResponse.existingResponse("User Already Verified");
        } else if (user.confirmOtp !== confirmOtp) {
            await this.userRepository.update({ email }, { otpTries: user.otpTries + 1 })
            return apiResponse.errorResponse("Invalid OTP");
        } else {
            await this.userRepository.update({ email }, { isConfirmed: true, status: true, confirmOtp: null, otpTries: 0 });
            user = await this.userRepository.findOne({ where: { email } })
            return apiResponse.successResponseWithData("OTP Confirmed", user.toResponseObject());
        }
    }

    async login(data: LoginDTO): Promise<object> {
        let user = await this.userRepository.findOne({ where: { email: data.email } });
        if (!user) {
            return apiResponse.unauthorizedResponse("Invalid Login Details");
        } else {
            const same = await bcrypt.compare(data.password, user.password)
            if (!same) {
                return apiResponse.unauthorizedResponse("Invalid Login Details");
            } else {
                if (!user.isConfirmed) {
                    return apiResponse.unauthorizedResponse("Account Not Confirmed");
                } else {
                    if (!user.status) {
                        return apiResponse.unauthorizedResponse("Account is Inactive, contact support");
                    } else {
                        let userData = { ...user.toResponseObject(), token: "" };
                        userData.token = await jwt.sign(user.toResponseObject(), process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIMEOUT_DURATION });
                        return apiResponse.successResponseWithData("Login Successful", userData);
                    }
                }
            }

        }
    }

    async resendOtp(data: EmailDTO): Promise<object> {
        const user = await this.userRepository.findOne({ where: { email: data.email } });
        if (!user || !user.confirmOtp) {
            return apiResponse.notFoundResponse('No User Found with OTP');
        } else {
            const from = { email: constants.confirmEmails.from, name: constants.confirmEmails.from };
            const personalization = [{
                to: [
                    { email: user.email, name: user.firstName }
                ]
            }];
            const dynamicTemplateData = {
                otp: user.confirmOtp,
                firstName: user.firstName,
            };
            const templateId = "d-f5198ee6ad3542a7944748f7d280d9a1";
            const emailStatus = await mailer.send(from, personalization, dynamicTemplateData, templateId);
            console.log(emailStatus);

            return apiResponse.successResponse('OTP Sent');
        }
    }

    async resetPassword(data: EmailDTO): Promise<object> {
        const user = await this.userRepository.findOne({ where: { email: data.email } });
        if (!user) {
            return apiResponse.notFoundResponse('No User Found');
        } else {
            const passwordResetToken = new Utility().randomNumber(6);
            await this.userRepository.update({ email: data.email }, { passwordResetToken });
            const from = { email: constants.confirmEmails.from, name: constants.confirmEmails.from };
            const personalization = [{
                to: [
                    { email: user.email, name: user.firstName }
                ]
            }];
            const dynamicTemplateData = {
                otp: passwordResetToken,
                firstName: user.firstName,
            };
            const templateId = "d-f5198ee6ad3542a7944748f7d280d9a1";
            const mailStatus = await mailer.send(from, personalization, dynamicTemplateData, templateId);
            console.log(mailStatus);
            return apiResponse.successResponse("Password Reset Email Sent");

        }
    }

    async newPassword(data: PasswordResetDTO) {
        let user = await this.userRepository.findOne({ where: { email: data.email } });
        if (!user) {
            return apiResponse.notFoundResponse("No user found");
        } else {
            if (!user.passwordResetToken) {
                return apiResponse.unauthorizedResponse("Unauthorized Action");
            } else {
                if (user.passwordResetToken !== data.passwordResetToken) {
                    return apiResponse.unauthorizedResponse("Expired Reset Token");
                } else {
                    const password = await bcrypt.hash(data.password, 10);
                    await this.userRepository.update({ email: data.email }, { password, passwordResetToken: null });
                    return apiResponse.successResponse('Password Updated');
                }
            }
        }
    }

    async deleteUser(id: string) {
        await this.userRepository.delete({ id });
        return { deleted: true }
    }

}
