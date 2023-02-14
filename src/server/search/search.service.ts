import { Injectable } from '@nestjs/common';
import { TnaDal } from '../data/tna.dal';
import {
  SearchResponseDto,
  TnaSearchResponse,
} from '../api/types/SearchResponse.dto';
import { OrpDal } from '../data/orp.dal';
import {
  SearchViewModel,
  TnaSearchResponseViewModel,
} from './types/SearchViewModel';
import { SearchRequestDto } from '../api/types/SearchRequest.dto';

@Injectable()
export class SearchService {
  constructor(
    private readonly tnaDal: TnaDal,
    private readonly orpDal: OrpDal,
  ) {}

  async search(searchRequest: SearchRequestDto): Promise<SearchResponseDto> {
    const [nationalArchive, orp] = await Promise.all([
      this.tnaDal.searchTna(searchRequest),
      this.orpDal.searchOrp(searchRequest),
    ]);

    return { nationalArchive, orp };
  }

  toTnaViewModel(tnaItem: TnaSearchResponse): TnaSearchResponseViewModel {
    return {
      ...tnaItem,
      documents: tnaItem.documents.map((document) => ({
        ...document,
        href: (document.links.find((link) => !link.rel) ?? document.links[0])
          .href,
      })),
    };
  }

  async searchForView(
    searchRequest: SearchRequestDto,
  ): Promise<SearchViewModel> {
    const { nationalArchive, orp } = await this.search(searchRequest);

    return {
      nationalArchive: this.toTnaViewModel(nationalArchive),
      orp,
    };
  }
}
