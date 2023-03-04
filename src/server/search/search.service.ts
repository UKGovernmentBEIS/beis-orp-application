import { Injectable } from '@nestjs/common';
import { TnaDal } from '../data/tna.dal';
import {
  SearchResponseDto,
  TnaSearchResponse,
} from './types/SearchResponse.dto';
import { OrpDal } from '../data/orp.dal';
import {
  SearchViewModel,
  TnaSearchResponseViewModel,
} from './types/SearchViewModel';
import { SearchRequestDto } from './types/SearchRequest.dto';
import { LinkedDocumentsRequestDto } from '../api/types/LinkedDocumentsRequest.dto';
import { LinkedDocumentsResponseDto } from './types/LinkedDocumentsResponse.dto';
import {
  mapLinkedDocuments,
  mapOrpSearchResponse,
} from './utils/orpSearchMapper';
import { RegulatorService } from '../regulator/regulator.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly tnaDal: TnaDal,
    private readonly orpDal: OrpDal,
    private readonly regulatorService: RegulatorService,
  ) {}

  async search(searchRequest: SearchRequestDto): Promise<SearchResponseDto> {
    const [legislation, regulatoryMaterial] = await Promise.all([
      this.tnaDal.searchTna(searchRequest),
      this.orpDal.searchOrp(searchRequest),
    ]);
    const regulators = await this.regulatorService.getRegulators();

    return {
      legislation,
      regulatoryMaterial: mapOrpSearchResponse(regulatoryMaterial, regulators),
    };
  }

  toTnaViewModel(tnaItem: TnaSearchResponse): TnaSearchResponseViewModel {
    return {
      ...tnaItem,
      documents: tnaItem.documents.map((document) => ({
        ...document,
        href: (
          document.links.find((link) => link.rel === 'self') ??
          document.links[0]
        ).href,
      })),
    };
  }

  async searchForView(
    searchRequest: SearchRequestDto,
  ): Promise<SearchViewModel> {
    const { legislation, regulatoryMaterial } = await this.search(
      searchRequest,
    );

    return {
      legislation: this.toTnaViewModel(legislation),
      regulatoryMaterial,
    };
  }

  async getLinkedDocuments({
    legislation_href,
  }: LinkedDocumentsRequestDto): Promise<LinkedDocumentsResponseDto> {
    const data = await this.orpDal.postSearch({
      legislation_href: [legislation_href].flat(),
    });
    const regulators = await this.regulatorService.getRegulators();

    return mapLinkedDocuments(data, regulators);
  }
}
