import { OrpDocumentStatus } from '../../search/entities/status-types';
import { DocumentType } from '../../search/entities/document-types';

export interface RawOrpResponseEntry {
  title: string;
  summary: string;
  document_uid: string;
  regulator_id?: string;
  date_uploaded: string;
  date_published?: string;
  legislative_origins: {
    href: string;
    title: string;
    type: string;
    division: string;
  }[];
  regulatory_topic?: string;
  version: number;
  document_type?: DocumentType;
  uri: string;
  keyword: string[];
  status: OrpDocumentStatus;
  document_format: 'PDF' | 'HTML' | 'DOCX';
}

export interface RawOrpResponse {
  total_search_results: number;
  documents: RawOrpResponseEntry[];
}

export interface RawLinkedDocumentsResponse {
  status_description: 'OK';
  status_code: number;
  documents: {
    related_docs: RelatedDoc[];
    legislation_href: string;
  }[];
  total_search_results: number;
}

export type RelatedDoc = Omit<
  RawOrpResponseEntry,
  'legislative_origins' | 'status'
>;

export const isRelatedDoc = (
  doc: RelatedDoc | RawOrpResponseEntry,
): doc is RelatedDoc => !('status' in doc || 'legislative_origins' in doc);
