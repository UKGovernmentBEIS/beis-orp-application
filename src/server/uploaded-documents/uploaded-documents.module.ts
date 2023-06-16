import { Logger, Module } from '@nestjs/common';
import { UploadedDocumentsController } from './uploaded-documents.controller';
import { UploadedDocumentsService } from './uploaded-documents.service';
import { OrpDal } from '../data/orp.dal';
import { HttpModule } from '@nestjs/axios';
import { DocumentModule } from '../document/document.module';
import { OrpSearchMapper } from '../search/utils/orp-search-mapper';
import { RegulatorService } from '../regulator/regulator.service';
import { OrpmlMapper } from '../document/utils/orpml-mapper';

@Module({
  imports: [HttpModule, DocumentModule],
  controllers: [UploadedDocumentsController],
  providers: [
    UploadedDocumentsService,
    OrpDal,
    Logger,
    OrpSearchMapper,
    OrpmlMapper,
    RegulatorService,
  ],
})
export class UploadedDocumentsModule {}
