import { Injectable } from '@nestjs/common';
import { TnaDal } from './tna.dal';
import { SearchResponseDto } from '../api/types/SearchResponse.dto';

@Injectable()
export class SearchService {
  constructor(private readonly tnaDal: TnaDal) {}

  async search(title: string, keyword: string): Promise<SearchResponseDto> {
    return {
      nationalArchive: await this.tnaDal.searchTna(title, keyword),
    };
  }
}
