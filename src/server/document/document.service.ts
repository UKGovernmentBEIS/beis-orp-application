import { Injectable, Logger } from '@nestjs/common';
import { OrpDal } from '../data/orp.dal';
import { AwsDal } from '../data/aws.dal';
import { UploadedFile } from '../data/types/UploadedFile';
import { FileUpload } from '../data/types/FileUpload';
import { Readable } from 'stream';
import { MetaItem, ObjectMetaData } from '../data/types/ObjectMetaData';
import { TnaDal } from '../data/tna.dal';
import { isEuDocument } from '../data/types/tnaDocs';
import TnaDocMeta from './types/TnaDocMeta';
import { getMetaFromEuDoc, getMetaFromUkDoc } from './utils/tnaMeta';
import { ApiUser, User } from '../auth/types/User';
import { mapOrpDocument } from '../search/utils/orpSearchMapper';
import { OrpSearchItem } from '../search/types/SearchResponse.dto';

@Injectable()
export class DocumentService {
  constructor(
    private readonly orpDal: OrpDal,
    private readonly awsDal: AwsDal,
    private readonly logger: Logger,
    private readonly tnaDal: TnaDal,
  ) {}

  async upload(
    fileUpload: FileUpload,
    user: User,
    unconfirmed?: boolean,
  ): Promise<UploadedFile> {
    const upload = await this.awsDal.upload(
      fileUpload,
      user.cognitoUsername,
      user.regulator.id,
      {},
      unconfirmed,
    );
    this.logger.log(
      `UI: file uploaded by ${user.regulator.name}, ${upload.key}`,
    );
    return upload;
  }

  async uploadFromApi(
    fileUpload: FileUpload,
    { regulator, cognitoUsername }: ApiUser,
    meta: Partial<ObjectMetaData>,
  ): Promise<UploadedFile> {
    const upload = await this.awsDal.upload(
      fileUpload,
      cognitoUsername,
      regulator,
      {
        ...meta,
        api_user: 'true',
      },
    );
    this.logger.log(`API: file uploaded by ${regulator}, ${upload.key}`);
    return upload;
  }

  async getDocumentStream(id: string): Promise<Readable> {
    const { uri } = await this.orpDal.getById(id);

    return this.awsDal.getObject(uri);
  }

  async getDocumentById(id: string): Promise<OrpSearchItem> {
    const document = await this.orpDal.getById(id);
    return mapOrpDocument(document);
  }

  async getDocumentWithPresignedUrl(
    id: string,
  ): Promise<{ document: OrpSearchItem; url: string }> {
    const document = await this.orpDal.getById(id);
    const url = await this.awsDal.getObjectUrl(document.uri);

    return {
      document: mapOrpDocument(document),
      url,
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

  async getTnaDocument(href: string): Promise<TnaDocMeta> {
    const document = await this.tnaDal.getDocumentById(href);
    return isEuDocument(document)
      ? getMetaFromEuDoc(document)
      : getMetaFromUkDoc(document);
  }
}
