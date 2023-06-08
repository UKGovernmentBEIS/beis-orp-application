import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import getJwtStrategyProps from './utils/get-jwt-strategy-props';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super(getJwtStrategyProps(config));
  }

  async validate(payload: any) {
    return !!payload.username;
  }
}
