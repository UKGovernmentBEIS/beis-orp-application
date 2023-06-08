import { Injectable } from '@nestjs/common';
import { TnaDal } from '../data/tna.dal';
import { SearchResponseDto } from './entities/search-response.dto';
import { OrpDal } from '../data/orp.dal';
import { SearchRequestDto } from './entities/search-request.dto';
import { LinkedDocumentsRequestDto } from '../api/entities/linked-documents-request.dto';
import { LinkedDocumentsResponseDto } from './entities/linked-documents-response.dto';
import { OrpSearchMapper } from './utils/orp-search-mapper';
import { mapTnaSearchResponse } from './utils/tna-search-mapper';

@Injectable()
export class SearchService {
  constructor(
    private readonly tnaDal: TnaDal,
    private readonly orpDal: OrpDal,
    private readonly orpSearchMapper: OrpSearchMapper,
  ) {}

  async search(searchRequest: SearchRequestDto): Promise<SearchResponseDto> {
    const [legislation, regulatoryMaterial] = await Promise.all([
      this.tnaDal.searchTna(searchRequest),
      this.orpDal.searchOrp(searchRequest),
    ]);

    return {
      legislation: mapTnaSearchResponse(legislation),
      regulatoryMaterial:
        this.orpSearchMapper.mapOrpSearchResponse(regulatoryMaterial),
    };
  }

  async getLinkedDocuments({
    legislation_href,
  }: LinkedDocumentsRequestDto): Promise<LinkedDocumentsResponseDto> {
    const data = await this.orpDal.postSearch({
      legislation_href: [legislation_href].flat(),
    });

    return this.orpSearchMapper.mapLinkedDocuments(data);
  }
}
