import { DocumentType } from '../../search/types/documentTypes';

export type OrpSearchBody = {
  keyword?: string;
  title?: string;
  regulator_id?: string[];
  date_published?: string;
  regulatory_topic?: string;
  status?: string;
  document_type?: DocumentType[];
};

export type OrpIdSearchBody = {
  id: string;
};
