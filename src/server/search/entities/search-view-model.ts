import { OrpSearchItem } from './search-response.dto';

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

interface OrpSearchResponse {
  totalSearchResults?: number;
  documents: OrpSearchItem[];
}

export interface SearchViewModel {
  legislation: TnaSearchResponseViewModel;
  regulatoryMaterial: OrpSearchResponse;
}
