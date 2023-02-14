import { Logger, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { DataModule } from '../data/data.module';
import { SearchController } from './search.controller';
import { RegulatorService } from '../regulator/regulator.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HttpModule, DataModule],
  providers: [SearchService, Logger, RegulatorService, PrismaService],
  exports: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
