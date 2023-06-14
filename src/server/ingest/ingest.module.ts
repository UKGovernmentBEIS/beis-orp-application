import { Logger, Module } from '@nestjs/common';
import { IngestController } from './ingest.controller';
import { DocumentModule } from '../document/document.module';
import { IngestDocumentController } from './ingest-document.controller';
import { IngestUrlController } from './ingest-url.controller';

@Module({
  imports: [DocumentModule],
  controllers: [
    IngestController,
    IngestDocumentController,
    IngestUrlController,
  ],
  providers: [Logger],
})
export class IngestModule {}
