import { Logger, Module } from '@nestjs/common';
import { DeveloperController } from './developer.controller';
import { ApiAuthService } from '../auth/api-auth.service';
import { RegulatorService } from '../regulator/regulator.service';
import { AuthService } from '../auth/auth.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ApiAuthService, RegulatorService, AuthService, Logger],
  controllers: [DeveloperController],
})
export class DeveloperModule {}
