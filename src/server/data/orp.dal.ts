import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import {
  OrpSearchItem,
  OrpSearchResponse,
} from '../api/types/SearchResponse.dto';

import { ApisConfig } from '../config';
import { ConfigService } from '@nestjs/config';
import {
  RawOrpResponse,
  RawOrpResponseEntry,
} from './types/rawOrpSearchResponse';
import { SearchRequestDto } from '../api/types/SearchRequest.dto';
import { OrpIdSearchBody, OrpSearchBody } from './types/orpSearchRequests';

const MAX_ITEMS = 10;

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

@Injectable()
export class OrpDal {
  private orpSearchUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
    private readonly logger: Logger,
  ) {
    this.orpSearchUrl = config.get<ApisConfig>('apis').orpSearch.url;
  }

  private mapResponse(response: RawOrpResponse): OrpSearchResponse {
    return {
      documents: response.documents
        .slice(0, MAX_ITEMS)
        .map<OrpSearchItem>((document) => ({
          title: document.title,
          summary: document.summary,
          documentId: document.document_uid,
          regulatorId: document.regulator_id,
          dates: {
            uploaded: document.date_uploaded,
            published: document.date_published,
          },
          legislativeOrigins: document.legislative_origins,
          regulatoryTopics: document.regulatory_topics,
          version: document.version,
          documentType: document.document_type,
        })),
      totalSearchResults: response.total_search_results,
    };
  }

  private async postSearch(
    params: OrpSearchBody | OrpIdSearchBody,
  ): Promise<RawOrpResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<RawOrpResponse>(this.orpSearchUrl, params),
      );
      return data;
    } catch (e) {
      this.logger.error('SEARCH LAMBDA ERROR');
      throw e;
    }
  }

  private mapToOrpSearchBody(searchRequest: SearchRequestDto): OrpSearchBody {
    const regulatorIdArray = [searchRequest.regulators].flat().filter(notEmpty);
    const docTypeArray = [searchRequest.docTypes].flat().filter(notEmpty);
    const statusArray = [searchRequest.status].flat().filter(notEmpty);

    return {
      keyword: searchRequest.keyword,
      title: searchRequest.title,
      regulator_id: regulatorIdArray.length ? regulatorIdArray : undefined,
      document_type: docTypeArray.length ? docTypeArray : undefined,
      status: statusArray.length
        ? statusArray.map((st) => (st === 'active' ? 'published' : st))
        : undefined,
    };
  }

  async searchOrp(searchRequest: SearchRequestDto): Promise<OrpSearchResponse> {
    const data = await this.postSearch(this.mapToOrpSearchBody(searchRequest));
    return this.mapResponse(data);
  }

  async getById(id: string): Promise<RawOrpResponseEntry> {
    const data = await this.postSearch({ id });

    if (!data.documents.length)
      throw new NotFoundException(`Document not found`);

    return data.documents[0];
  }
}
