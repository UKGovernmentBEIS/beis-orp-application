import { Logger, Module } from '@nestjs/common';
import { RegulatorService } from './regulator.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [RegulatorService, PrismaService, Logger],
})
export class RegulatorModule {}
