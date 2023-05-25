import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { OrpDal } from '../data/orp.dal';
import { AwsDal } from '../data/aws.dal';
import { UploadedFile } from '../data/types/UploadedFile';
import { FileUpload } from '../data/types/FileUpload';
import { Readable } from 'stream';
import { ObjectMetaData } from '../data/types/ObjectMetaData';
import { TnaDal } from '../data/tna.dal';
import { isEuDocument } from '../data/types/tnaDocs';
import TnaDocMeta from './types/TnaDocMeta';
import { getMetaFromEuDoc, getMetaFromUkDoc } from './utils/tnaMeta';
import { ApiUser, User } from '../auth/types/User';
import { mapOrpDocument } from '../search/utils/orpSearchMapper';
import { OrpSearchItem } from '../search/types/SearchResponse.dto';
import { displayableMimeTypes } from './utils/mimeTypes';
import { topicsLeafMap } from './utils/topics-leaf-map';
import { UserCollectedUrlUploadData } from '../data/types/UrlUpload';
import { v4 as uuidv4 } from 'uuid';

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
        topics: JSON.stringify(topicsLeafMap[meta.topics]),
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

  async getDocumentUrl(
    key: string,
  ): Promise<{ documentFormat: string; url: string }> {
    const meta = await this.getDocumentMeta(key);

    return {
      url: displayableMimeTypes.includes(meta.document_format)
        ? await this.awsDal.getObjectUrl(key)
        : null,
      documentFormat: meta.document_format,
    };
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

  async ingestUrl(
    metaData: UserCollectedUrlUploadData,
    user: User,
  ): Promise<string> {
    const uuid = uuidv4();
    return this.orpDal.ingestUrl({
      ...metaData,
      user_id: user.cognitoUsername,
      regulator_id: user.regulator.id,
      uuid,
    });
  }

  async deleteDocument(id: string, user: User) {
    const document = await this.getDocumentById(id);
    if (document.regulatorId !== user.regulator.id) {
      throw new ForbiddenException();
    }
    return this.orpDal.deleteDocument(id, user.regulator.id);
  }

  async updateMeta(key: string, meta: Partial<ObjectMetaData>, user: User) {
    const oldMeta = await this.getDocumentMeta(key);
    if (oldMeta.regulator_id !== user.regulator.id) {
      throw new ForbiddenException();
    }
    return this.awsDal.updateMetaData(key, meta, oldMeta);
  }

  async getTnaDocument(href: string): Promise<TnaDocMeta> {
    const document = await this.tnaDal.getDocumentById(href);
    return isEuDocument(document)
      ? getMetaFromEuDoc(document)
      : getMetaFromUkDoc(document);
  }
}
