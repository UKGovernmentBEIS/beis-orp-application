import { Logger, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { DataModule } from '../data/data.module';
import { SearchController } from './search.controller';
import { OrpSearchMapper } from './utils/orp-search-mapper';
import { RegulatorService } from '../regulator/regulator.service';

@Module({
  imports: [HttpModule, DataModule],
  providers: [SearchService, Logger, OrpSearchMapper, RegulatorService],
  exports: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
