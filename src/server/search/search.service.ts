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

@Injectable()
export class SearchService {
  constructor(
    private readonly tnaDal: TnaDal,
    private readonly orpDal: OrpDal,
  ) {}

  async search(
    title: string | undefined,
    keyword: string | undefined,
  ): Promise<SearchResponseDto> {
    const [nationalArchive, orp] = await Promise.all([
      this.tnaDal.searchTna(title, keyword),
      this.orpDal.searchOrp(title, keyword),
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
    title: string | undefined,
    keyword: string | undefined,
  ): Promise<SearchViewModel> {
    const { nationalArchive, orp } = await this.search(title, keyword);

    return {
      nationalArchive: this.toTnaViewModel(nationalArchive),
      orp,
    };
  }
}
