import { Logger, Module } from '@nestjs/common';
import { IngestController } from './ingest.controller';
import { DocumentModule } from '../document/document.module';

@Module({
  imports: [DocumentModule],
  controllers: [IngestController],
  providers: [Logger],
})
export class IngestModule {}
