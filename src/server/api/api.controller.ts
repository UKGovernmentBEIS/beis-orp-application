import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUpload } from '../aws/types/FileUpload';

@Controller('api')
export class ApiController {
  constructor(private awsService: AwsService) {}

  @Put('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'pdf' })],
      }),
    )
    file: FileUpload,
  ) {
    await this.awsService.upload(file);
    return 'success';
  }
}
