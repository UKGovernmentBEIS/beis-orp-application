import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DataModule } from '../data/data.module';

@Module({
  imports: [DataModule],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
