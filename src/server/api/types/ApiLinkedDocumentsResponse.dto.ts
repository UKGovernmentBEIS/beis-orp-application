import { ApiOrpSearchItem } from './ApiSearchResponse.dto';

export class ApiLinkedDocumentsResponseDto {
  total_search_results: number;
  documents: ApiLinkedDocuments[];
}

class ApiLinkedDocuments {
  related_documents: ApiOrpSearchItem[];
  legislation_href: string;
}
