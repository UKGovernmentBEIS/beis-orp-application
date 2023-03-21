import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as convert from 'xml-js';
import { SearchRequestDto } from '../search/types/SearchRequest.dto';
import { TnaEuDoc, TnaPrimaryUkDoc, TnaSecondaryUkDoc } from './types/tnaDocs';
import { RawTnaResponse } from './types/rawTnaSearchResponse';

export const TNA_URL = 'https://www.legislation.gov.uk/all';

@Injectable()
export class TnaDal {
  constructor(private readonly httpService: HttpService) {}

  private getTnaUrl(publishedFromDate: string, publishedToDate: string) {
    if (!publishedFromDate || !publishedToDate) {
      return `${TNA_URL}/data.feed`;
    }

    const from = new Date(publishedFromDate).getFullYear();
    const to = new Date(publishedToDate).getFullYear();
    return `${TNA_URL}/${from}-${to}/data.feed`;
  }

  async searchTna({
    title,
    keyword,
    publishedFromDate,
    publishedToDate,
  }: SearchRequestDto): Promise<RawTnaResponse> {
    const url = this.getTnaUrl(publishedFromDate, publishedToDate);

    const { data } = await firstValueFrom(
      this.httpService.get(url, { params: { title, text: keyword } }),
    );

    return JSON.parse(convert.xml2json(data, { compact: true }));
  }

  async getDocumentById(
    href,
  ): Promise<TnaPrimaryUkDoc | TnaSecondaryUkDoc | TnaEuDoc> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${href}/data.xml`),
    );
    return JSON.parse(convert.xml2json(data, { compact: true }));
  }
}
