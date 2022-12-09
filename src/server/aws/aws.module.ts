import { Logger, Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsFileUploader } from './aws-file-uploader';

@Module({
  providers: [AwsService, AwsFileUploader, Logger],
  exports: [AwsService],
})
export class AwsModule {}
