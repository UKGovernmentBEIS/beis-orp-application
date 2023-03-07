import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import getJwtStrategyProps from './utils/getJwtStrategyProps';
import { ApiAuthService } from './api-auth.service';
import { AuthException } from './types/AuthException';
import { ApiUser } from './types/User';

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

  async validate(payload: any): Promise<ApiUser> {
    const { Username, UserAttributes } = await this.apiAuthService.getClient(
      payload.username,
    );

    const userRegulator = UserAttributes.find(
      (attr) => attr.Name === 'custom:regulator',
    )?.Value;

    if (!userRegulator) {
      throw new AuthException({ code: 'NotAuthorizedException' });
    }
    return {
      cognitoUsername: Username,
      regulator: userRegulator,
    };
  }
}
