import { RegulatorService } from '../../src/server/regulator/regulator.service';

export const mockRegulatorService = {
  provide: RegulatorService,
  useValue: {
    getRegulators: () => [
      { id: 'ofcom', name: 'Office of Communications', domain: 'ofcom.org.uk' },
    ],
  },
};
