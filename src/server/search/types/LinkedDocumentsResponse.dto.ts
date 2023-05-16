import { OrpSearchItem } from './SearchResponse.dto';

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
