import { Logger, Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { SearchModule } from '../search/search.module';
import { DocumentModule } from '../document/document.module';
import { ApiKeyService } from '../auth/apiKey.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ApiController],
  imports: [SearchModule, DocumentModule],
  providers: [ApiKeyService, PrismaService, Logger],
})
export class ApiModule {}
