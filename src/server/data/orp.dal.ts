import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { ApisConfig } from '../config/application-config';
import { ConfigService } from '@nestjs/config';
import {
  RawLinkedDocumentsResponse,
  RawOrpResponse,
  RawOrpResponseEntry,
} from './types/rawOrpSearchResponse';
import {
  OrpIdSearchBody,
  OrpLinkedDocsSearchBody,
  OrpSearchBody,
} from './types/orpSearchRequests';
import { SearchRequestDto } from '../search/types/SearchRequest.dto';

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

  async postSearch(
    params: OrpLinkedDocsSearchBody,
  ): Promise<RawLinkedDocumentsResponse>;
  async postSearch(
    params: OrpSearchBody | OrpIdSearchBody,
  ): Promise<RawOrpResponse>;
  async postSearch(
    params: OrpSearchBody | OrpIdSearchBody | OrpLinkedDocsSearchBody,
  ): Promise<RawOrpResponse | RawLinkedDocumentsResponse> {
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
    const topic =
      searchRequest.topic2 && searchRequest.topic2 !== 'all'
        ? searchRequest.topic2
        : searchRequest.topic1 && searchRequest.topic1 !== 'all'
        ? searchRequest.topic1
        : undefined;

    return {
      keyword: searchRequest.keyword,
      title: searchRequest.title,
      regulator_id: regulatorIdArray.length ? regulatorIdArray : undefined,
      document_type: docTypeArray.length ? docTypeArray : undefined,
      status: statusArray.length
        ? statusArray.map((st) => (st === 'active' ? 'published' : st))
        : undefined,
      date_published: {
        start_date: searchRequest.publishedFromDate,
        end_date: searchRequest.publishedToDate,
      },
      regulatory_topic: topic || undefined,
    };
  }

  async searchOrp(searchRequest: SearchRequestDto): Promise<RawOrpResponse> {
    return this.postSearch(this.mapToOrpSearchBody(searchRequest));
  }

  async getById(id: string): Promise<RawOrpResponseEntry> {
    const data = await this.postSearch({ id });

    if (!data.documents.length)
      throw new NotFoundException('Document not found');

    return data.documents[0];
  }
}
