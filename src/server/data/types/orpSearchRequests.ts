import { DocumentType } from '../../search/types/documentTypes';

export type OrpSearchBody = {
  keyword?: string;
  title?: string;
  regulator_id?: string[];
  date_published?: { start_date: string; end_date: string };
  regulatory_topic?: string;
  status?: ('published' | 'draft')[];
  document_type?: DocumentType[];
};

export type OrpIdSearchBody = {
  id: string;
};
