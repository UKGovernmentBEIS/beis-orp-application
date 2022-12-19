import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { TnaDal } from './tna.dal';
import { OrpDal } from './orp.dal';

@Module({
  imports: [HttpModule],
  providers: [SearchService, TnaDal, OrpDal],
  exports: [SearchService],
})
export class SearchModule {}
