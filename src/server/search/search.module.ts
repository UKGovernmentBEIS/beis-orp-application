import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { DataModule } from '../data/data.module';

@Module({
  imports: [HttpModule, DataModule],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
