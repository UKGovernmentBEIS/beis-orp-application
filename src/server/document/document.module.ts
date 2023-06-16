import { Logger, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DataModule } from '../data/data.module';
import { DocumentController } from './document.controller';
import { SearchModule } from '../search/search.module';
import { OrpSearchMapper } from '../search/utils/orp-search-mapper';
import { RegulatorService } from '../regulator/regulator.service';
import { OrpmlMapper } from './utils/orpml-mapper';

@Module({
  imports: [DataModule, SearchModule],
  providers: [
    DocumentService,
    Logger,
    OrpSearchMapper,
    RegulatorService,
    OrpmlMapper,
  ],
  exports: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
