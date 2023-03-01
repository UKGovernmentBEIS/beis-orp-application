class TnaSearchItem {
  title?: string;
  author?: string;
  dates: {
    updated?: string;
    published?: string;
  };
  legislationType?: string;
  links: TnaLink[];
  number?: number;
  year?: number;
}

class TnaLink {
  title?: string;
  type?: string;
  href: string;
  rel?: string;
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
}

class LegislativeOrigin {
  url: string;
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
