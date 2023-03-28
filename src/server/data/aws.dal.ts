import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { AwsConfig } from '../config/application-config';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FileUpload } from './types/FileUpload';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from './types/UploadedFile';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { ObjectMetaData } from './types/ObjectMetaData';
import { User } from '../auth/types/User';

@Injectable()
export class AwsDal {
  private awsConfig: AwsConfig;
  private client: S3Client;

  constructor(private config: ConfigService, private readonly logger: Logger) {
    this.awsConfig = config.get<AwsConfig>('aws');
    this.client = new S3Client({
      region: this.awsConfig.region,
    });
  }

  async upload(
    { mimetype, buffer, originalname }: FileUpload,
    cognitoUsername: User['cognitoUsername'],
    regulatorId: User['regulator']['id'],
    meta: Partial<ObjectMetaData> = {},
    unconfirmed = false,
  ): Promise<UploadedFile> {
    try {
      const uuid = uuidv4();
      const fileKey = `${
        unconfirmed ? 'unconfirmed/' : ''
      }${uuid}-${originalname}`.toLocaleLowerCase();
      const command = new PutObjectCommand({
        Bucket: this.awsConfig.ingestionBucket,
        Key: fileKey,
        ContentType: mimetype,
        Body: buffer,
        Metadata: {
          uuid,
          uploaded_date: new Date().toTimeString(),
          file_name: originalname,
          regulator_id: regulatorId,
          user_id: cognitoUsername,
          document_format: mimetype,
          ...meta,
        },
        ACL: 'authenticated-read',
      });
      await this.client.send(command);

      return { key: fileKey, id: uuid };
    } catch (e) {
      this.logger.error('Upload error', e.stack);
      throw new InternalServerErrorException(
        'There was a problem uploading the document',
      );
    }
  }

  async getObject(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.awsConfig.ingestionBucket,
      Key: key,
    });
    return (await this.client.send(command)).Body as Readable;
  }

  getObjectUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.awsConfig.ingestionBucket,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn: 10 });
  }

  async getObjectMeta(key: string): Promise<ObjectMetaData> {
    const command = new HeadObjectCommand({
      Bucket: this.awsConfig.ingestionBucket,
      Key: key,
    });
    const headObject = await this.client.send(command);
    return {
      ...headObject.Metadata,
      document_format: headObject.ContentType,
    } as unknown as ObjectMetaData;
  }

  async copyObject(key: string, newKey: string) {
    const command = new CopyObjectCommand({
      Bucket: this.awsConfig.ingestionBucket,
      CopySource: `${this.awsConfig.ingestionBucket}/${key}`,
      Key: newKey,
    });
    await this.client.send(command);
    this.logger.log(`File copied, ${key} to ${newKey}`);
    return { from: key, to: newKey };
  }

  async deleteObject(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.awsConfig.ingestionBucket,
      Key: key,
    });
    await this.client.send(command);
    this.logger.log(`File deleted, ${key}`);
    return { deleted: key };
  }

  async updateMetaData(key, newMeta: Record<string, string>) {
    const meta = await this.getObjectMeta(key);
    const command = new CopyObjectCommand({
      Bucket: this.awsConfig.ingestionBucket,
      Key: key,
      MetadataDirective: 'REPLACE',
      CopySource: `${this.awsConfig.ingestionBucket}/${key}`,
      ContentType: meta.document_format,
      Metadata: {
        ...meta,
        ...newMeta,
      },
    });
    await this.client.send(command);

    this.logger.log(`File meta updated, ${key}`);
    return { updated: key };
  }
}
