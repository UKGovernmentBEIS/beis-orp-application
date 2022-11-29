import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsFileUploader } from './aws-file-uploader';

@Module({
  providers: [AwsService, AwsFileUploader],
  exports: [AwsService],
})
export class AwsModule {}
