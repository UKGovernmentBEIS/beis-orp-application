import { Module } from '@nestjs/common';
import { RegulatorService } from './regulator.service';

@Module({
  providers: [RegulatorService],
  exports: [RegulatorService],
})
export class RegulatorModule {}
