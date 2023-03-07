import { Injectable } from '@nestjs/common';
import regulators from './config/regulators';
import { Regulator } from './types/Regulator';

@Injectable()
export class RegulatorService {
  getRegulatorByEmail(emailAddress: string): Regulator | null | undefined {
    const domain = emailAddress.split('@')[1];
    if (!domain) return null;
    return regulators.find((regulator) => regulator.domain === domain);
  }

  getRegulators(): Regulator[] {
    return regulators;
  }

  getRegulatorById(id: string): Regulator | undefined {
    return regulators.find((regulator) => regulator.id === id);
  }
}
