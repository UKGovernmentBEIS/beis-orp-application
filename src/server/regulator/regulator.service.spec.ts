import { Test, TestingModule } from '@nestjs/testing';
import { RegulatorService } from './regulator.service';
import { mockConfigService } from '../../../test/mocks/config.mock';

describe('RegulatorService', () => {
  let service: RegulatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegulatorService, mockConfigService],
    }).compile();

    service = module.get<RegulatorService>(RegulatorService);
  });

  describe('getRegulatorByEmail', () => {
    it('should return null if no domain in request', async () => {
      const result = await service.getRegulatorByEmail('emailregulator.com');
      expect(result).toEqual(null);
    });

    it('should return value from config', async () => {
      const result = await service.getRegulatorByEmail('email@ofcom.org.uk');
      expect(result).toEqual({
        id: 'ofcom',
        name: 'Office of Communications',
        domain: 'ofcom.org.uk',
      });
    });

    it('should return value from env var', async () => {
      const result = await service.getRegulatorByEmail('email@public.io');
      expect(result).toEqual({
        id: 'public.io',
        name: 'public.io',
        domain: 'public.io',
      });
    });
  });
});
