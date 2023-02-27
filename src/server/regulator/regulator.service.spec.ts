import { Test, TestingModule } from '@nestjs/testing';
import { RegulatorService } from './regulator.service';
import {
  DEFAULT_REGULATOR,
  mockPrismaService,
} from '../../../test/mocks/prismaService.mock';

describe('RegulatorService', () => {
  let service: RegulatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegulatorService, mockPrismaService],
    }).compile();

    service = module.get<RegulatorService>(RegulatorService);
  });

  describe('getRegulatorByEmail', () => {
    it('should return null if no domain in request', async () => {
      const result = await service.getRegulatorByEmail('emailregulator.com');
      expect(result).toEqual(null);
    });

    it('should return value from prisma', async () => {
      const result = await service.getRegulatorByEmail('email@regulator.com');
      expect(result).toEqual(DEFAULT_REGULATOR);
    });
  });

  describe('getRegulatorById', () => {
    it('should return value from prisma', async () => {
      const result = await service.getRegulatorById('regId');
      expect(result).toEqual(DEFAULT_REGULATOR);
    });
  });
});
