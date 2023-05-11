import { Logger, Module } from '@nestjs/common';
import { UploadedDocumentsController } from './uploaded-documents.controller';
import { UploadedDocumentsService } from './uploaded-documents.service';
import { OrpDal } from '../data/orp.dal';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [UploadedDocumentsController],
  providers: [UploadedDocumentsService, OrpDal, Logger],
})
export class UploadedDocumentsModule {}
