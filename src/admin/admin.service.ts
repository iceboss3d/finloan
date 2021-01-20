import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { apiResponse } from 'src/helpers/apiResponse';
import { Repository } from 'typeorm';
import { AdminActivateDTO, AdminCreateDTO, AdminLoginDTO, IAdmin } from './admin.dto';
import { AdminEntity } from './admin.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { mailer } from 'src/helpers/Mailer';
import { constants } from 'src/helpers/constants';
import { Utility } from 'src/helpers/utility';

@Injectable()
export class AdminService {
    constructor(@InjectRepository(AdminEntity) private adminRepository: Repository<AdminEntity>) { }

    async listAdmin(adminData: IAdmin) {
        if(adminData.role !== "super-admin"){
            return apiResponse.unauthorizedResponse("Only Super Admins Can Create Admins");
        }
        const admins = await this.adminRepository.find();
        return apiResponse.successResponseWithData("Successfully Fetched Admins", admins);
    }

    async createAdmin(data: AdminCreateDTO, adminData: IAdmin) {
        if(adminData.role !== "super-admin"){
            return apiResponse.unauthorizedResponse("Only Super Admins Can Create Admins");
        }
        const passwordResetToken = new Utility().randomNumber(6);
        const { firstName, lastName, email, phoneNumber, password, role } = data;

        const check = await this.adminRepository.findOne({where: {email}});

        if(check){
            return apiResponse.existingResponse("Admin with such Email already exists");
        }

        const admin = await this.adminRepository.create({firstName, lastName, email, phoneNumber, password, role, passwordResetToken});
        
        const savedAdmin = await this.adminRepository.save(admin);     
        const from = { email: constants.confirmEmails.from, name: constants.confirmEmails.from };
        const personalization = [{
            to: [
                { email: admin.email, name: admin.firstName }
            ]
        }];
        const dynamicTemplateData = {
            otp: admin.passwordResetToken,
            firstName: admin.firstName,
        };
        
        const templateId = "d-f5198ee6ad3542a7944748f7d280d9a1";
        const emailResponse = mailer.send(from, personalization, dynamicTemplateData, templateId);
        console.log(emailResponse);
        
        if (!savedAdmin) {
            return apiResponse.errorResponse("Unable to Create Admin")
        }
        return apiResponse.successResponseWithData("Admin Successfully Created", savedAdmin.toResponseObject());
    }

    async loginAdmin(data: AdminLoginDTO): Promise<object> {
        let admin = await this.adminRepository.findOne({ where: { email: data.email } });
        if (!admin) {
            return apiResponse.unauthorizedResponse("Invalid Login Details");
        } else {
            const same = await bcrypt.compare(data.password, admin.password)
            if (!same) {
                return apiResponse.unauthorizedResponse("Invalid Login Details");
            } else {
                if (!admin.status) {
                    return apiResponse.unauthorizedResponse('Account Not Active, Contact System Admin');
                } else {
                    let adminData = { ...admin.toResponseObject(), token: "" };
                    adminData.token = jwt.sign(admin.toResponseObject(), process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIMEOUT_DURATION });
                    return apiResponse.successResponseWithData("Login Successful", adminData);
                }
            }
        }
    }

    async activateAccount(data: AdminActivateDTO){
        let admin = await this.adminRepository.findOne({where: {email: data.email}})
        if(!admin){
            return apiResponse.notFoundResponse("Admin Account Not Found");
        } else {
            if(admin.status){
                return apiResponse.existingResponse("Admin Account Activated Already");
            } else {
                if(admin.passwordResetToken !== data.passwordResetToken){
                    return apiResponse.unauthorizedResponse("Invalid Token");
                } else {
                    const password = await bcrypt.hash(data.password, 10);
                    await this.adminRepository.update({email: data.email}, {password, passwordResetToken: null, status: true});
                    // TODO: Email Account Activated.
                    return apiResponse.successResponse('Account Activated');
                }
            }
        }
    }
}

