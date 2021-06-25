import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GuarantorEntity } from './guarantor.entity';
import { GuarantorService } from './guarantor.service';

describe('GuarantorService', () => {
  let service: GuarantorService;

  const mockGuarantorEntity = {
    find: jest.fn().mockImplementation()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuarantorService, {
        provide: getRepositoryToken(GuarantorEntity),
        useValue: mockGuarantorEntity
      }],
    }).compile();

    service = module.get<GuarantorService>(GuarantorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
