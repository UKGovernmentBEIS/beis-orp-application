interface TnaSearchItemViewModel {
  title?: string;
  author?: string;
  dates: {
    updated?: string;
    published?: string;
  };
  legislationType?: string;
  links: TnaLink[];
  href: string;
  number?: number;
  year?: number;
}

interface TnaLink {
  title?: string;
  type?: string;
  href: string;
}

export interface TnaSearchResponseViewModel {
  totalSearchResults?: number;
  documents: TnaSearchItemViewModel[];
}

interface OrpSearchItem {
  title: string;
  summary: string;
  documentId: string;
  regulatorId?: string;
  dates: {
    uploaded: string;
    published: string;
  };
  legislativeOrigins: LegislativeOrigin[];
  regulatoryTopics?: string[];
  version: number;
  documentType?: string;
}

interface LegislativeOrigin {
  url: string;
  title: string;
  type: string;
  division: string;
}

interface OrpSearchResponse {
  totalSearchResults?: number;
  documents: OrpSearchItem[];
}

export interface SearchViewModel {
  nationalArchive: TnaSearchResponseViewModel;
  orp: OrpSearchResponse;
}
