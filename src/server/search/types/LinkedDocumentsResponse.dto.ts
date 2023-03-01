import { OrpSearchItem } from './SearchResponse.dto';

export class LinkedDocumentsResponseDto {
  totalSearchResults: number;
  documents: LinkedDocuments[];
}

class LinkedDocuments {
  relatedDocuments: OrpSearchItem[];
  legislationHref: string;
}
