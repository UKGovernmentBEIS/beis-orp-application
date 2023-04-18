import { Injectable } from '@nestjs/common';
import regulators from './config/regulators';
import { Regulator } from './types/Regulator';
import { ConfigService } from '@nestjs/config';
import { EnvironmentRegulator } from '../config/application-config';

@Injectable()
export class RegulatorService {
  private environmentRegulators: EnvironmentRegulator[] = [];
  constructor(private readonly config: ConfigService) {
    this.environmentRegulators = config.get<EnvironmentRegulator[]>(
      'environmentRegulators',
    );
  }
  getRegulatorByEmail(emailAddress: string): Regulator | null | undefined {
    const domain = emailAddress.split('@')[1];
    if (!domain) return null;
    return [...regulators, ...this.environmentRegulators].find(
      (regulator) => regulator.domain === domain,
    );
  }
}
