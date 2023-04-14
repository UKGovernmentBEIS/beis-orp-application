class TnaSearchItem {
  id: string;
  title?: string;
  author?: string;
  dates: {
    updated?: string;
    published?: string;
  };
  legislationType?: string;
  number?: number;
  year?: number;
}

export class TnaSearchResponse {
  totalSearchResults?: number;
  documents: TnaSearchItem[];
}

export class OrpSearchItem {
  title: string;
  description: string;
  documentId: string;
  creator?: string;
  dates: {
    uploaded: string;
    published: string;
  };
  legislativeOrigins?: LegislativeOrigin[];
  regulatoryTopics?: string[];
  version: number;
  documentType?: string;
  keyword: string[];
  status?: 'published' | 'draft';
  uri: string;
  documentFormat: 'PDF' | 'HTML' | 'DOCX';
}

class LegislativeOrigin {
  href: string;
  title: string;
  type: string;
  division: string;
}

export class OrpSearchResponse {
  totalSearchResults?: number;
  documents: OrpSearchItem[];
}

export class SearchResponseDto {
  legislation: TnaSearchResponse;
  regulatoryMaterial: OrpSearchResponse;
}
