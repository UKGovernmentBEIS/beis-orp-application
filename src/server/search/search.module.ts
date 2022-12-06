import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { TnaDal } from './tna.dal';

@Module({
  imports: [HttpModule],
  providers: [SearchService, TnaDal],
  exports: [SearchService],
})
export class SearchModule {}
