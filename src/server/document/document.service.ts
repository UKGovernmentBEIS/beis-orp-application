import { Injectable } from '@nestjs/common';
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
  ) {}

  upload(fileUpload: FileUpload): Promise<UploadedFile> {
    return this.awsDal.upload(fileUpload);
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
