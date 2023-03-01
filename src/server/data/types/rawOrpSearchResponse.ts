import { OrpDocumentStatus } from '../../search/types/statusTypes';

export interface RawOrpResponseEntry {
  title: string;
  summary: string;
  document_uid: string;
  regulator_id?: string;
  date_uploaded: string;
  date_published?: string;
  legislative_origins: {
    url: string;
    title: string;
    type: string;
    division: string;
  }[];
  regulatory_topics?: string[];
  version: number;
  document_type?: string;
  uri: string;
  keyword: string[];
  status: OrpDocumentStatus;
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

type RelatedDoc = Omit<RawOrpResponseEntry, 'legislative_origins' | 'status'>;
