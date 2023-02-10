import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import getJwtStrategyProps from './utils/getJwtStrategyProps';
import { ApiAuthService } from './api-auth.service';

@Injectable()
export default class JwtRegulatorStrategy extends PassportStrategy(
  Strategy,
  'jwt-regulator',
) {
  constructor(
    private readonly config: ConfigService,
    protected readonly apiAuthService: ApiAuthService,
  ) {
    super(getJwtStrategyProps(config));
  }

  async validate(payload: any) {
    const user = await this.apiAuthService.getClient(payload.username);
    return !!user.UserAttributes.find(
      (attr) => attr.Name === 'custom:regulator',
    )?.Value;
  }
}
