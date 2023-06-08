import { Injectable } from '@nestjs/common';
import regulators from './config/regulators';
import { Regulator } from './entities/regulator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegulatorService {
  private regulators: Regulator[];
  private allRegulators: Regulator[];
  constructor(private readonly config: ConfigService) {
    const environmentRegulators = config.get<string>('environmentRegulators');

    this.regulators = regulators;
    this.allRegulators = [
      ...regulators,
      ...environmentRegulators.split(',').map((reg) => ({
        name: reg,
        domain: reg,
        id: reg,
      })),
    ];
  }

  getRegulators(includeEnvRegulators = false): Regulator[] {
    return includeEnvRegulators ? this.allRegulators : this.regulators;
  }

  getRegulatorById(id: string) {
    return this.allRegulators.find((reg) => reg.id === id);
  }
  getRegulatorByName(name: string) {
    return this.allRegulators.find((reg) => reg.name === name);
  }

  getRegulatorByEmail(emailAddress: string): Regulator | null | undefined {
    const domain = emailAddress.split('@')[1];
    if (!domain) return null;
    return this.allRegulators.find((regulator) => regulator.domain === domain);
  }
}
