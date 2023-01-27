import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';
import { ApiKeyService } from './apiKey.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [PassportModule.register({ session: true })],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    ApiKeyService,
    PrismaService,
    Logger,
    UserService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
