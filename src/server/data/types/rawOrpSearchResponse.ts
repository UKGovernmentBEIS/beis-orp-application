export interface RawOrpResponseEntry {
  title: string;
  summary: string;
  document_uid: string;
  regulator_id?: string;
  uri: string;
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
  object_key: string;
}

export interface RawOrpResponse {
  total_search_results: number;
  documents: RawOrpResponseEntry[];
}
