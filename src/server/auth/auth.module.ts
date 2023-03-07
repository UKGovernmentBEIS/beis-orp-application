import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';
import { JwtStrategy } from './jwt.strategy';
import { RegulatorService } from '../regulator/regulator.service';
import JwtRegulatorStrategy from './jwt-regulator.strategy';
import { ApiAuthService } from './api-auth.service';

@Module({
  imports: [PassportModule.register({ session: true })],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    Logger,
    JwtStrategy,
    JwtRegulatorStrategy,
    RegulatorService,
    ApiAuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
