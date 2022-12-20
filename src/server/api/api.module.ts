import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { SearchModule } from '../search/search.module';
import { DocumentModule } from '../document/document.module';

@Module({
  controllers: [ApiController],
  imports: [SearchModule, DocumentModule],
})
export class ApiModule {}
