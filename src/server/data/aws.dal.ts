import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { AwsConfig } from '../config';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FileUpload } from './types/FileUpload';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from './types/UploadedFile';
import { Readable } from 'stream';

@Injectable()
export class AwsDal {
  private awsConfig: AwsConfig;
  private client: S3;

  constructor(private config: ConfigService, private readonly logger: Logger) {
    this.awsConfig = config.get<AwsConfig>('aws');
    this.client = new S3({
      region: 'eu-west-2',
    });
  }

  async upload({
    mimetype,
    buffer,
    originalname,
  }: FileUpload): Promise<UploadedFile> {
    try {
      const uuid = uuidv4();
      const fileKey = `trigger-pipeline/${uuid}-${originalname}`;
      await this.client
        .putObject({
          Bucket: this.awsConfig.ingestionBucket,
          Key: fileKey,
          ContentType: mimetype,
          Body: buffer,
          Metadata: {
            uuid,
            uploadedDate: new Date().toTimeString(),
          },
          ACL: 'authenticated-read',
        })
        .promise();

      this.logger.log(
        `FILE UPLOADED, ${this.awsConfig.ingestionBucket}/${fileKey}`,
      );
      return { path: `${this.awsConfig.ingestionBucket}/${fileKey}` };
    } catch (e) {
      this.logger.error('UPLOAD ERROR', e.stack);
      throw new InternalServerErrorException(
        'There was a problem uploading the document',
      );
    }
  }

  getObject(uri: string): Readable {
    return this.client
      .getObject({
        Bucket: this.awsConfig.ingestionBucket,
        Key: uri,
      })
      .createReadStream();
  }
}
