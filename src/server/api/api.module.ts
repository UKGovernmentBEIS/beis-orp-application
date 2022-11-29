import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { AwsModule } from '../aws/aws.module';

@Module({
  controllers: [ApiController],
  imports: [AwsModule],
})
export class ApiModule {}
