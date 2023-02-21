import { DocumentType } from '../../search/types/documentTypes';
import { OrpDocumentStatus } from '../../search/types/statusTypes';

export interface ObjectMetaData {
  uuid: string;
  uploadeddate: string;
  filename: string;
  documenttype?: DocumentType | 'OTHER';
  status?: OrpDocumentStatus;
}

export type MetaItem = keyof ObjectMetaData;
