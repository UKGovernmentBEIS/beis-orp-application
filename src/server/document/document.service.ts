import { Injectable, Logger } from '@nestjs/common';
import { OrpDal } from '../data/orp.dal';
import { AwsDal } from '../data/aws.dal';
import { UploadedFile } from '../data/types/UploadedFile';
import { FileUpload } from '../data/types/FileUpload';
import { Readable } from 'stream';
import { RawOrpResponseEntry } from '../data/types/rawOrpSearchResponse';

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
  ): Promise<UploadedFile> {
    const upload = await this.awsDal.upload(fileUpload);
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
}
