import { Injectable } from '@nestjs/common';
import { TnaDal } from '../data/tna.dal';
import { SearchResponseDto } from '../api/types/SearchResponse.dto';
import { OrpDal } from '../data/orp.dal';

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
}
