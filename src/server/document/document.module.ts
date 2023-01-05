import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DataModule } from '../data/data.module';
import { DocumentController } from './document.controller';

@Module({
  imports: [DataModule],
  providers: [DocumentService],
  exports: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
