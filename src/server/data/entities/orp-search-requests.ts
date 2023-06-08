import { DocumentType } from '../../search/entities/document-types';
import { OrpDocumentStatus } from '../../search/entities/status-types';

export type OrpSearchBody = {
  keyword?: string;
  title?: string;
  regulator_id?: string[];
  date_published?: { start_date: string; end_date: string };
  regulatory_topic?: string;
  status?: OrpDocumentStatus[];
  document_type?: DocumentType[];
  page?: number;
  page_size?: number;
};

export type OrpIdSearchBody = {
  id: string;
};

export type OrpLinkedDocsSearchBody = {
  legislation_href: string[];
};
