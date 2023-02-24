import { Logger, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { DataModule } from '../data/data.module';
import { SearchController } from './search.controller';
import { RegulatorService } from '../regulator/regulator.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [HttpModule, DataModule, PrismaModule],
  providers: [SearchService, Logger, RegulatorService],
  exports: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
