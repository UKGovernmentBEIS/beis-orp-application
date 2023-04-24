import { DocumentType } from '../../search/types/documentTypes';
import { OrpDocumentStatus } from '../../search/types/statusTypes';

export interface ObjectMetaData {
  uuid: string;
  uploaded_date: string;
  file_name: string;
  document_type?: DocumentType | 'OTHER';
  status?: OrpDocumentStatus;
  api_user?: string;
  document_format: string;
  topics?: string;
  regulator_id?: string;
}

export type MetaItem = keyof ObjectMetaData;
