import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import {
  OrpSearchItem,
  OrpSearchResponse,
} from '../api/types/SearchResponse.dto';

import { RawOrpResponse } from './types/rawOrpSearchResponse';
import { ApisConfig } from '../config';
import { ConfigService } from '@nestjs/config';

const MAX_ITEMS = 10;

@Injectable()
export class OrpDal {
  private orpSearchUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
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
            published: document.data_published,
          },
          legislativeOrigins: document.legislative_origins,
          regulatoryTopics: document.regulatory_topics,
          version: document.version,
          documentType: document.document_type,
        })),
      totalSearchResults: response.total_search_results,
    };
  }

  async searchOrp(
    title: string | undefined,
    keywords: string | undefined,
  ): Promise<OrpSearchResponse> {
    const { data } = await firstValueFrom(
      this.httpService.post<RawOrpResponse>(this.orpSearchUrl, {
        title,
        keywords,
      }),
    );

    return this.mapResponse(data);
  }
}
