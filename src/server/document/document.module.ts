import { Logger, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DataModule } from '../data/data.module';
import { DocumentController } from './document.controller';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [DataModule, SearchModule],
  providers: [DocumentService, Logger],
  exports: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
