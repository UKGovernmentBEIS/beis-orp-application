import {
  RawLinkedDocumentsResponse,
  RawOrpResponse,
  RawOrpResponseEntry,
} from '../../data/types/rawOrpSearchResponse';
import { OrpSearchItem, OrpSearchResponse } from '../types/SearchResponse.dto';
import { LinkedDocumentsResponseDto } from '../types/LinkedDocumentsResponse.dto';
import { documentTypes } from '../types/documentTypes';
import regulators from '../../regulator/config/regulators';
import { getTopicPathFromLeaf } from '../../ingest/utils/topics';

const MAX_ITEMS = 10;
export function mapOrpDocument(
  document: Partial<RawOrpResponseEntry>,
): OrpSearchItem {
  return {
    title: document.title,
    description: document.summary,
    documentId: document.document_uid,
    regulatorId: document.regulator_id,
    creator:
      regulators.find((reg) => reg.id === document.regulator_id)?.name ??
      document.regulator_id,
    dates: {
      uploaded: document.date_uploaded,
      published: document.date_published,
    },
    legislativeOrigins: document.legislative_origins,
    regulatoryTopics: document.regulatory_topic
      ? getTopicPathFromLeaf(document.regulatory_topic)
      : undefined,
    version: document.version,
    documentType: documentTypes[document.document_type] ?? 'Other',
    documentTypeId: document.document_type,
    keyword: document.keyword,
    status: document.status,
    uri: document.uri,
    documentFormat: document.document_format,
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
      relatedDocuments: legislation.related_docs.map((relatedDoc) => ({
        ...mapOrpDocument(relatedDoc),
        uri: undefined,
        documentFormat: undefined,
        regulatorId: undefined,
        documentTypeId: undefined,
      })),
    })),
    totalSearchResults: response.total_search_results,
  };
}
