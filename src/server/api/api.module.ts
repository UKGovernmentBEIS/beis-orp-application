import { Logger, Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { SearchModule } from '../search/search.module';
import { DocumentModule } from '../document/document.module';
import { AuthService } from '../auth/auth.service';
import { RegulatorService } from '../regulator/regulator.service';
import { ApiAuthService } from '../auth/api-auth.service';

@Module({
  controllers: [ApiController],
  imports: [SearchModule, DocumentModule],
  providers: [Logger, AuthService, RegulatorService, ApiAuthService],
})
export class ApiModule {}
