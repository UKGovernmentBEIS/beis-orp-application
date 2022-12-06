import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { AwsModule } from '../aws/aws.module';
import { SearchModule } from '../search/search.module';

@Module({
  controllers: [ApiController],
  imports: [AwsModule, SearchModule],
})
export class ApiModule {}
