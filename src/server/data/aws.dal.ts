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
import { FileUpload } from './entities/file-upload';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from './entities/uploaded-file';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { ObjectMetaData } from './entities/object-meta-data';
import { User } from '../auth/entities/user';
import * as convert from 'xml-js';
import { RawOrpml } from './entities/raw-orpml';

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

  async getOrpml(id: string): Promise<{ orpml: RawOrpml }> {
    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      });

    const command = new GetObjectCommand({
      Bucket: this.awsConfig.orpmlBucket,
      Key: `processed/${id}.orpml`,
    });

    const { Body } = await this.client.send(command);
    const xmlString = (await streamToString(Body)) as string;
    return JSON.parse(convert.xml2json(xmlString, { compact: true }));
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

  async updateMetaData(
    key,
    newMeta: Partial<ObjectMetaData>,
    oldMeta: Partial<ObjectMetaData>,
  ) {
    const command = new CopyObjectCommand({
      Bucket: this.awsConfig.ingestionBucket,
      Key: key,
      MetadataDirective: 'REPLACE',
      CopySource: `${this.awsConfig.ingestionBucket}/${key}`,
      ContentType: oldMeta.document_format,
      Metadata: {
        ...oldMeta,
        ...newMeta,
      },
    });
    await this.client.send(command);

    this.logger.log(`File meta updated, ${key}`);
    return { updated: key };
  }
}
