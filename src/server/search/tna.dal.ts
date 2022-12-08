import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as convert from 'xml-js';
import { TnaSearchResponse } from '../api/types/SearchResponse.dto';

import { RawTnaResponse } from './types/tnaSearchResponse';

export const TNA_URL = 'https://www.legislation.gov.uk/all/data.feed';
const MAX_ITEMS = 10;

@Injectable()
export class TnaDal {
  constructor(private readonly httpService: HttpService) {}

  private responseMapper(stringifiedJson: string): TnaSearchResponse {
    const response: RawTnaResponse = JSON.parse(stringifiedJson);

    return {
      items: [response.feed.entry]
        .flat()
        .filter((item) => item)
        .slice(0, MAX_ITEMS)
        .map((entry) => ({
          title: entry.title._text,
          author: entry.author.name._text,
          updated: entry.updated._text,
          published: entry.published._text,
          legislationType: entry['ukm:DocumentMainType']._attributes.Value,
          links: [entry.link]
            .flat()
            .filter((item) => item)
            .map((link) => ({
              title: link._attributes.title,
              href: link._attributes.href,
              type: link._attributes.type,
            })),
        })),
      totalItems: response.feed['openSearch:totalResults']?._text
        ? Number(response.feed['openSearch:totalResults']?._text)
        : undefined,
    };
  }

  async searchTna(title: string, keyword: string): Promise<TnaSearchResponse> {
    const params = {
      title: title ? title : undefined,
      text: keyword ? keyword : undefined,
    };
    const { data } = await firstValueFrom(
      this.httpService.get(TNA_URL, { params }),
    );

    return this.responseMapper(convert.xml2json(data, { compact: true }));
  }
}
