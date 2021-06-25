import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationEntity } from 'src/application/application.entity';
import { ErrorMessages } from 'src/helpers/error-messages.enum';
import { Repository } from 'typeorm';
import { GuarantorDTO } from './guarantor.dto';
import { GuarantorEntity } from './guarantor.entity';

@Injectable()
export class GuarantorService {
    constructor(
        @InjectRepository(GuarantorEntity)
        private readonly guarantorRepository: Repository<GuarantorEntity>
    ) {}

    async createGuarantor(application: ApplicationEntity, data: GuarantorDTO) {
        const guarantor = await this.findGuarantor(application.id);
        if(guarantor){
            throw new BadRequestException(ErrorMessages.EXISTING_RESOURCE);
        }
        const newGuarantor = this.guarantorRepository.create({...data, application});
        await this.guarantorRepository.save(newGuarantor);
        return guarantor;
    }

    async findGuarantor(applicationId: string) {
        const guarantor = await this.guarantorRepository.findOne({where: {application: {id: applicationId}}});
        return guarantor;
    }
}
