class TnaSearchItem {
  title: string;
  author?: string;
  dates: {
    updated: string;
    published: string;
  };
  legislationType: string;
  links: TnaLink[];
  number: number;
  year: number;
}

class TnaLink {
  title?: string;
  type?: string;
  href: string;
}

export class TnaSearchResponse {
  totalSearchResults?: number;
  documents: TnaSearchItem[];
}

export class OrpSearchItem {
  title: string;
  summary: string;
  documentId: string;
  regulatorId: string;
  dates: {
    uploaded: string;
    published: string;
  };
  legislativeOrigins: LegislativeOrigin[];
  regulatoryTopics: string[];
  version: number;
  documentType: string;
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
  nationalArchive: TnaSearchResponse;
  orp: OrpSearchResponse;
}
