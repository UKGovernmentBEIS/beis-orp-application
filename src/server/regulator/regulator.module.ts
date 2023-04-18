import { Module } from '@nestjs/common';
import { RegulatorService } from './regulator.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [RegulatorService, ConfigService],
  exports: [RegulatorService],
})
export class RegulatorModule {}
