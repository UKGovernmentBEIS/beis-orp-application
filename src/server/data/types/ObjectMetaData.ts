import { DocumentType } from '../../search/types/documentTypes';

export interface ObjectMetaData {
  uuid: string;
  uploadeddate: string;
  filename: string;
  documenttype?: DocumentType | 'OTHER';
}
