import { Injectable } from '@nestjs/common';
import regulators from './config/regulators';
import { Regulator } from './types/Regulator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegulatorService {
  private allRegulators: Regulator[];
  constructor(private readonly config: ConfigService) {
    const environmentRegulators = config.get<string>('environmentRegulators');

    this.allRegulators = [
      ...regulators,
      ...environmentRegulators.split(',').map((reg) => ({
        name: reg,
        domain: reg,
        id: reg,
      })),
    ];
  }

  getRegulatorByEmail(emailAddress: string): Regulator | null | undefined {
    const domain = emailAddress.split('@')[1];
    if (!domain) return null;
    return this.allRegulators.find((regulator) => regulator.domain === domain);
  }
}
