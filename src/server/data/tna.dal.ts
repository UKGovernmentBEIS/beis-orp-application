import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as convert from 'xml-js';
import { TnaSearchResponse } from '../search/types/SearchResponse.dto';

import {
  isLanguageTitle,
  RawTitle,
  RawTnaResponse,
} from './types/rawTnaSearchResponse';
import { SearchRequestDto } from '../search/types/SearchRequest.dto';
import { TnaEuDoc, TnaUkDoc } from './types/tnaDocs';
import { getTnaDocType } from '../document/utils/tnaDocumentType.config';

export const TNA_URL = 'https://www.legislation.gov.uk/all/data.feed';
const MAX_ITEMS = 10;

const maybeNumber = (item: string | number) =>
  item ? Number(item) : undefined;

@Injectable()
export class TnaDal {
  constructor(private readonly httpService: HttpService) {}

  private mapResponse(stringifiedJson: string): TnaSearchResponse {
    const response: RawTnaResponse = JSON.parse(stringifiedJson);

    function getTitle(rawTitle?: RawTitle): string | undefined {
      if (!rawTitle) return;
      if (isLanguageTitle(rawTitle)) {
        const english = rawTitle.div.span.find(
          ({ _attributes }) => _attributes['xml:lang'] === 'en',
        );
        return english?._text ?? rawTitle.div.span[0]._text;
      }

      return rawTitle._text;
    }

    return {
      documents: [response.feed.entry]
        .flat()
        .filter((item) => item)
        .slice(0, MAX_ITEMS)
        .map((entry) => ({
          title: getTitle(entry.title),
          author: entry.author?.name?._text,
          dates: {
            updated: entry.updated?._text,
            published: entry.published?._text,
          },
          legislationType: getTnaDocType(
            entry['ukm:DocumentMainType']?._attributes?.Value,
          ).legType,
          links: [entry.link]
            .flat()
            .filter((item) => item)
            .map((link) => ({
              title: link._attributes?.title,
              href: link._attributes?.href,
              type: link._attributes?.type,
              rel: link._attributes?.rel,
            })),
          number: maybeNumber(entry['ukm:Number']?._attributes?.Value),
          year: maybeNumber(entry['ukm:Year']?._attributes?.Value),
        })),
      totalSearchResults: maybeNumber(
        response.feed['openSearch:totalResults']?._text,
      ),
    };
  }

  async searchTna({
    title,
    keyword,
  }: SearchRequestDto): Promise<TnaSearchResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get(TNA_URL, { params: { title, text: keyword } }),
    );

    return this.mapResponse(convert.xml2json(data, { compact: true }));
  }

  async getDocumentById(href): Promise<TnaUkDoc | TnaEuDoc> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${href}/data.xml`),
    );
    return JSON.parse(convert.xml2json(data, { compact: true }));
  }
}
