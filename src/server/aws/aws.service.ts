import { Injectable } from '@nestjs/common';
import { AwsFileUploader } from './aws-file-uploader';
import { FileUpload } from './types/FileUpload';
import { UploadedFile } from './types/UploadedFile';

@Injectable()
export class AwsService {
  constructor(private awsFileUploader: AwsFileUploader) {}

  upload(fileUpload: FileUpload): Promise<UploadedFile> {
    return this.awsFileUploader.upload(fileUpload);
  }
}
