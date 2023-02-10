import { Logger, Module } from '@nestjs/common';
import { DeveloperController } from './developer.controller';
import { ApiAuthService } from '../auth/api-auth.service';
import { RegulatorService } from '../regulator/regulator.service';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [
    ApiAuthService,
    RegulatorService,
    AuthService,
    Logger,
    PrismaService,
  ],
  controllers: [DeveloperController],
})
export class DeveloperModule {}
