import { Module } from '@nestjs/common';
import { RegulatorService } from './regulator.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RegulatorService],
})
export class RegulatorModule {}
