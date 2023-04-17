class TnaSearchItem {
  id: string;
  title?: string;
  author?: string;
  dates: {
    updated?: string;
    published?: string;
  };
  legislation_type?: string;
  number?: number;
  year?: number;
}

export class TnaSearchResponse {
  total_search_results?: number;
  documents: TnaSearchItem[];
}

export class ApiOrpSearchItem {
  title: string;
  description: string;
  document_id: string;
  creator?: string;
  dates: {
    uploaded: string;
    published: string;
  };
  legislative_origins?: LegislativeOrigin[];
  regulatory_topics?: string[];
  version: number;
  document_type?: string;
  keyword: string[];
  status?: 'published' | 'draft';
}

class LegislativeOrigin {
  href: string;
  title: string;
  type: string;
  division: string;
}

export class OrpSearchResponse {
  total_search_results?: number;
  documents: ApiOrpSearchItem[];
}

export class ApiSearchResponseDto {
  legislation: TnaSearchResponse;
  regulatory_material: OrpSearchResponse;
}
