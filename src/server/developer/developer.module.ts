import { Logger, Module } from '@nestjs/common';
import { DeveloperController } from './developer.controller';
import { ApiAuthService } from '../auth/api-auth.service';
import { RegulatorService } from '../regulator/regulator.service';

@Module({
  providers: [ApiAuthService, RegulatorService, Logger],
  controllers: [DeveloperController],
})
export class DeveloperModule {}
