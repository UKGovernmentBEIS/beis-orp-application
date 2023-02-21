import { DocumentType } from '../../search/types/documentTypes';
import { OrpDocumentStatus } from '../../search/types/statusTypes';

export type OrpSearchBody = {
  keyword?: string;
  title?: string;
  regulator_id?: string[];
  date_published?: { start_date: string; end_date: string };
  regulatory_topic?: string;
  status?: OrpDocumentStatus[];
  document_type?: DocumentType[];
};

export type OrpIdSearchBody = {
  id: string;
};
