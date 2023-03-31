import { Module } from '@nestjs/common';
import { SupportingLinksController } from './supporting-links.controller';

@Module({
  controllers: [SupportingLinksController],
})
export class SupportingLinksModule {}
