import { Injectable } from '@nestjs/common';
import { TnaDal } from '../data/tna.dal';
import { SearchResponseDto } from './types/SearchResponse.dto';
import { OrpDal } from '../data/orp.dal';
import { SearchRequestDto } from './types/SearchRequest.dto';
import { LinkedDocumentsRequestDto } from '../api/types/LinkedDocumentsRequest.dto';
import { LinkedDocumentsResponseDto } from './types/LinkedDocumentsResponse.dto';
import {
  mapLinkedDocuments,
  mapOrpSearchResponse,
} from './utils/orpSearchMapper';
import { mapTnaSearchResponse } from './utils/tnaSearchMapper';

@Injectable()
export class SearchService {
  constructor(
    private readonly tnaDal: TnaDal,
    private readonly orpDal: OrpDal,
  ) {}

  async search(searchRequest: SearchRequestDto): Promise<SearchResponseDto> {
    const [legislation, regulatoryMaterial] = await Promise.all([
      this.tnaDal.searchTna(searchRequest),
      this.orpDal.searchOrp(searchRequest),
    ]);

    return {
      legislation: mapTnaSearchResponse(legislation),
      regulatoryMaterial: mapOrpSearchResponse(regulatoryMaterial),
    };
  }

  async getLinkedDocuments({
    legislation_href,
  }: LinkedDocumentsRequestDto): Promise<LinkedDocumentsResponseDto> {
    const data = await this.orpDal.postSearch({
      legislation_href: [legislation_href].flat(),
    });

    return mapLinkedDocuments(data);
  }
}
