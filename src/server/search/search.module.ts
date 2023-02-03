import { Logger, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { DataModule } from '../data/data.module';
import { SearchController } from './search.controller';

@Module({
  imports: [HttpModule, DataModule],
  providers: [SearchService, Logger],
  exports: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
