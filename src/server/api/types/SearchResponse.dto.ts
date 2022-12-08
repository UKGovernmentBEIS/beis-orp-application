class TnaSearchItem {
  title: string;
  author?: string;
  updated: string;
  published: string;
  legislationType: string;
  links: TnaLink[];
}

class TnaLink {
  title?: string;
  type?: string;
  href: string;
}

export class TnaSearchResponse {
  totalItems?: number;
  items: TnaSearchItem[];
}

export class SearchResponseDto {
  nationalArchive: TnaSearchResponse;
}
