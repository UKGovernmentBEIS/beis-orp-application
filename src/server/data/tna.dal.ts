import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as convert from 'xml-js';
import { TnaSearchResponse } from '../api/types/SearchResponse.dto';

import { RawTnaResponse } from './types/rawTnaSearchResponse';

export const TNA_URL = 'https://www.legislation.gov.uk/all/data.feed';
const MAX_ITEMS = 10;

const maybeNumber = (item: string | number) =>
  item ? Number(item) : undefined;

@Injectable()
export class TnaDal {
  constructor(private readonly httpService: HttpService) {}

  private mapResponse(stringifiedJson: string): TnaSearchResponse {
    const response: RawTnaResponse = JSON.parse(stringifiedJson);

    return {
      documents: [response.feed.entry]
        .flat()
        .filter((item) => item)
        .slice(0, MAX_ITEMS)
        .map((entry) => ({
          title: entry.title?._text,
          author: entry.author?.name?._text,
          dates: {
            updated: entry.updated?._text,
            published: entry.published?._text,
          },
          legislationType: entry['ukm:DocumentMainType']?._attributes?.Value,
          links: [entry.link]
            .flat()
            .filter((item) => item)
            .map((link) => ({
              title: link._attributes?.title,
              href: link._attributes?.href,
              type: link._attributes?.type,
            })),
          number: maybeNumber(entry['ukm:Number']?._attributes?.Value),
          year: maybeNumber(entry['ukm:Year']?._attributes?.Value),
        })),
      totalSearchResults: maybeNumber(
        response.feed['openSearch:totalResults']?._text,
      ),
    };
  }

  async searchTna(title: string, keywords: string): Promise<TnaSearchResponse> {
    const params = {
      title: title ? title : undefined,
      text: keywords ? keywords : undefined,
    };
    const { data } = await firstValueFrom(
      this.httpService.get(TNA_URL, { params }),
    );

    return this.mapResponse(convert.xml2json(data, { compact: true }));
  }
}
