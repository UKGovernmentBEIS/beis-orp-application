import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as convert from 'xml-js';
import { SearchRequestDto } from '../search/types/SearchRequest.dto';
import { TnaEuDoc, TnaPrimaryUkDoc, TnaSecondaryUkDoc } from './types/tnaDocs';
import { RawTnaResponse } from './types/rawTnaSearchResponse';

export const TNA_URL = 'https://www.legislation.gov.uk/all/data.feed';

@Injectable()
export class TnaDal {
  constructor(private readonly httpService: HttpService) {}

  async searchTna({
    title,
    keyword,
  }: SearchRequestDto): Promise<RawTnaResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get(TNA_URL, { params: { title, text: keyword } }),
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
