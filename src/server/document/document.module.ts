import { Logger, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DataModule } from '../data/data.module';
import { DocumentController } from './document.controller';
import { RegulatorModule } from '../regulator/regulator.module';

@Module({
  imports: [DataModule, RegulatorModule],
  providers: [DocumentService, Logger],
  exports: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
