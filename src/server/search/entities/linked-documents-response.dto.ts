import { OrpSearchItem } from './search-response.dto';

export class LinkedDocumentsResponseDto {
  totalSearchResults: number;
  documents: LinkedDocuments[];
}

export class LinkedDocuments {
  relatedDocuments: Omit<
    OrpSearchItem,
    'uri' | 'documentFormat' | 'documentTypeId' | 'regulatorId'
  >[];
  legislationHref: string;
}
