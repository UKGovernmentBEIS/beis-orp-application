import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtRegulatorGuard extends AuthGuard('jwt-regulator') {}
