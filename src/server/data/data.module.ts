import { Logger, Module } from '@nestjs/common';
import { AwsDal } from './aws.dal';
import { OrpDal } from './orp.dal';
import { HttpModule } from '@nestjs/axios';
import { TnaDal } from './tna.dal';

@Module({
  imports: [HttpModule],
  providers: [AwsDal, OrpDal, TnaDal, Logger],
  exports: [AwsDal, OrpDal, TnaDal],
})
export class DataModule {}
