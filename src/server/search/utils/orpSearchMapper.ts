import {
  RawLinkedDocumentsResponse,
  RawOrpResponse,
  RawOrpResponseEntry,
} from '../../data/types/rawOrpSearchResponse';
import { OrpSearchItem, OrpSearchResponse } from '../types/SearchResponse.dto';
import { LinkedDocumentsResponseDto } from '../types/LinkedDocumentsResponse.dto';
import { documentTypes } from '../types/documentTypes';
import regulators from '../../regulator/config/regulators';

const MAX_ITEMS = 10;
export function mapOrpDocument(document: RawOrpResponseEntry): OrpSearchItem {
  return {
    title: document.title,
    description: document.summary,
    documentId: document.document_uid,
    creator: regulators.find((reg) => reg.id === document.regulator_id)?.name,
    dates: {
      uploaded: document.date_uploaded,
      published: document.date_published,
    },
    legislativeOrigins: document.legislative_origins,
    regulatoryTopics: document.regulatory_topics,
    version: document.version,
    documentType: documentTypes[document.document_type],
    keyword: document.keyword,
    status: document.status,
  };
}

export function mapOrpSearchResponse(
  response: RawOrpResponse,
): OrpSearchResponse {
  return {
    documents: response.documents
      .slice(0, MAX_ITEMS)
      .map<OrpSearchItem>(mapOrpDocument),
    totalSearchResults: response.total_search_results,
  };
}

export function mapLinkedDocuments(
  response: RawLinkedDocumentsResponse,
): LinkedDocumentsResponseDto {
  return {
    documents: response.documents.map((legislation) => ({
      legislationHref: legislation.legislation_href,
      relatedDocuments: legislation.related_docs.map(mapOrpDocument),
    })),
    totalSearchResults: response.total_search_results,
  };
}
