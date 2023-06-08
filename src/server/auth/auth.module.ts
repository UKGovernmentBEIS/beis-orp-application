import { Logger, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';
import { JwtStrategy } from './jwt.strategy';
import { RegulatorService } from '../regulator/regulator.service';
import JwtRegulatorStrategy from './jwt-regulator.strategy';
import { ApiAuthService } from './api-auth.service';
import { ClientAuthService } from './client-auth.service';
import { ClientAuthController } from './client-auth.controller';
import { MagicLinkStrategy } from './magic-link.strategy';

@Module({
  imports: [PassportModule.register({ session: true })],
  providers: [
    SessionSerializer,
    Logger,
    JwtStrategy,
    JwtRegulatorStrategy,
    RegulatorService,
    ApiAuthService,
    ClientAuthService,
    MagicLinkStrategy,
  ],
  controllers: [ClientAuthController],
})
export class AuthModule {}
