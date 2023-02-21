import { Injectable, Logger } from '@nestjs/common';
import { OrpDal } from '../data/orp.dal';
import { AwsDal } from '../data/aws.dal';
import { UploadedFile } from '../data/types/UploadedFile';
import { FileUpload } from '../data/types/FileUpload';
import { Readable } from 'stream';
import { RawOrpResponseEntry } from '../data/types/rawOrpSearchResponse';
import { MetaItem, ObjectMetaData } from '../data/types/ObjectMetaData';

@Injectable()
export class DocumentService {
  constructor(
    private readonly orpDal: OrpDal,
    private readonly awsDal: AwsDal,
    private readonly logger: Logger,
  ) {}

  async upload(
    fileUpload: FileUpload,
    regulator: string,
    unconfirmed?: boolean,
  ): Promise<UploadedFile> {
    const upload = await this.awsDal.upload(fileUpload, unconfirmed);
    this.logger.log(`file uploaded by ${regulator}, ${upload.key}`);
    return upload;
  }

  async getDocument(id: string): Promise<Readable> {
    const { object_key } = await this.orpDal.getById(id);

    return this.awsDal.getObject(object_key);
  }

  async getDocumentDetail(
    id: string,
  ): Promise<{ document: RawOrpResponseEntry; url: string }> {
    const document = await this.orpDal.getById(id);
    return {
      document,
      url: await this.awsDal.getObjectUrl(document.object_key),
    };
  }

  async getDocumentUrl(key: string): Promise<string> {
    return this.awsDal.getObjectUrl(key);
  }

  getDocumentMeta(key: string): Promise<ObjectMetaData> {
    return this.awsDal.getObjectMeta(key);
  }

  async confirmDocument(key: string): Promise<string> {
    const newKey = key.replace('unconfirmed/', '');
    await this.awsDal.copyObject(key, newKey);
    await this.awsDal.deleteObject(key);
    return newKey;
  }

  async deleteDocument(key: string) {
    return this.awsDal.deleteObject(key);
  }

  async updateMeta(key: string, meta: Partial<Record<MetaItem, string>>) {
    return this.awsDal.updateMetaData(key, meta);
  }
}
