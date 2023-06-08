import {
  RawLinkedDocumentsResponse,
  RawOrpResponse,
  RawOrpResponseEntry,
} from '../../data/entities/raw-orp-search-response';
import {
  OrpSearchItem,
  OrpSearchResponse,
} from '../entities/search-response.dto';
import { LinkedDocumentsResponseDto } from '../entities/linked-documents-response.dto';
import { documentTypes } from '../entities/document-types';
import { getTopicPathFromLeaf } from '../../ingest/utils/topics';
import { Injectable } from '@nestjs/common';
import { RegulatorService } from '../../regulator/regulator.service';

const MAX_ITEMS = 10;

@Injectable()
export class OrpSearchMapper {
  constructor(private readonly regulatorService: RegulatorService) {}
  mapOrpDocument(document: Partial<RawOrpResponseEntry>) {
    const regulator = this.regulatorService.getRegulatorById(
      document.regulator_id,
    );
    return {
      title: document.title,
      description: document.summary,
      documentId: document.document_uid,
      regulatorId: document.regulator_id,
      creator: regulator?.name ?? document.regulator_id,
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

  mapOrpSearchResponse(response: RawOrpResponse): OrpSearchResponse {
    return {
      documents: response.documents
        .slice(0, MAX_ITEMS)
        .map<OrpSearchItem>((item) => this.mapOrpDocument(item)),
      totalSearchResults: response.total_search_results,
    };
  }

  mapLinkedDocuments(
    response: RawLinkedDocumentsResponse,
  ): LinkedDocumentsResponseDto {
    return {
      documents: response.documents.map((legislation) => ({
        legislationHref: legislation.legislation_href,
        relatedDocuments: legislation.related_docs.map((relatedDoc) => ({
          ...this.mapOrpDocument(relatedDoc),
          uri: undefined,
          documentFormat: undefined,
          regulatorId: undefined,
          documentTypeId: undefined,
        })),
      })),
      totalSearchResults: response.total_search_results,
    };
  }
}
