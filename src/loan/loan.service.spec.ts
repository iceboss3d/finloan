import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { ScheduleDTO } from '../schedule/schedule.dto';
import { ScheduleService } from '../schedule/schedule.service';
import { LoanDTO } from './loan.dto';
import { LoanEntity } from './loan.entity';
import { LoanService } from './loan.service';

const approvedBy = {
  id: "someRandomId",
  firstName: "Ayebakuro",
  lastName: "Ombu",
  email: "xplicitkuro@gmail.com",
  phoneNumber: "07083584630",
  status: true,
  iat: 7558833904,
  exp: 6738920348
}


const loanDto = {
  commencementDate: new Date(),
  approvedBy
}

const application = new ApplicationEntity()
application.id = "someId"
application.amount = 10000
application.tenure = 3
application.interestRate = 5

describe('LoanService', () => {
  let service: LoanService;
  const mockLoanRepository = {
    create: jest.fn().mockImplementation((loanData) => {
      const loanA = new LoanEntity();
      loanA.id = 'someId';
      loanA.endDate = loanData.endDate;
      loanA.totalLoan = loanData.totalLoan;
      loanA.commencementDate = loanData.commencementDate;
      loanA.approvedBy = loanData.approvedBy;
      return loanA;
    }),
    save: jest
      .fn()
      .mockImplementation((loanData) => Promise.resolve({ ...loanData })),
  };

  const mockScheduleServiceImp = {
    createSchedule: jest.fn((schedule: ScheduleDTO, loan: LoanEntity) => {
      return { schedule, loan };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        {
          provide: getRepositoryToken(LoanEntity),
          useValue: mockLoanRepository,
        },
        ScheduleService,
      ],
    })
      .overrideProvider(ScheduleService)
      .useValue(mockScheduleServiceImp)
      .compile();

    service = module.get<LoanService>(LoanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create Loan', () => {
    it('Should Create a Loan Entity', async () => {
      expect(
        await service.createLoan(loanDto, application)
      ).toBeInstanceOf(LoanEntity)
    })
  })
  
});
