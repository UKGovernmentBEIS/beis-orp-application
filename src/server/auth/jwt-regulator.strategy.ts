import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegulatorService } from '../regulator/regulator.service';
import getJwtStrategyProps from './utils/getJwtStrategyProps';

@Injectable()
export default class JwtRegulatorStrategy extends PassportStrategy(
  Strategy,
  'jwt-regulator',
) {
  constructor(
    private readonly config: ConfigService,
    protected readonly authService: AuthService,
    protected readonly regulatorService: RegulatorService,
  ) {
    super(getJwtStrategyProps(config));
  }

  async validate(payload: any) {
    const user = await this.authService.getUser(payload.username);
    const emailAddress = user.UserAttributes.find(
      (attr) => attr.Name === 'email',
    ).Value;
    const regulator = await this.regulatorService.getRegulatorByEmail(
      emailAddress,
    );

    return !!regulator?.name;
  }
}
