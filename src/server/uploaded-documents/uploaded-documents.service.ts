import { Injectable } from '@nestjs/common';
import { OrpDal } from '../data/orp.dal';
import { OrpSearchResponse } from '../search/types/SearchResponse.dto';
import { mapOrpSearchResponse } from '../search/utils/orpSearchMapper';
import { User } from '../auth/types/User';
import { SearchRequestDto } from '../search/types/SearchRequest.dto';

@Injectable()
export class UploadedDocumentsService {
  constructor(private readonly orpDal: OrpDal) {}

  async findAll(user: User): Promise<OrpSearchResponse> {
    const searchRequest: SearchRequestDto = { regulators: user.regulator.id };
    const regulatoryMaterial = await this.orpDal.searchOrp(searchRequest);

    const results = mapOrpSearchResponse(regulatoryMaterial);
    return {
      ...results,
      documents: results.documents.sort(
        (a, b) =>
          new Date(b.dates.published).valueOf() -
          new Date(a.dates.published).valueOf(),
      ),
    };
  }
}
