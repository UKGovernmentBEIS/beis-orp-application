import { Module } from '@nestjs/common';
import { IngestController } from './ingest.controller';
import { DocumentModule } from '../document/document.module';

@Module({
  imports: [DocumentModule],
  controllers: [IngestController],
})
export class IngestModule {}
