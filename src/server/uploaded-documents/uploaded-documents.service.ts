import { Injectable } from '@nestjs/common';
import { OrpDal } from '../data/orp.dal';
import { OrpSearchResponse } from '../search/entities/search-response.dto';
import { mapOrpSearchResponse } from '../search/utils/orp-search-mapper';
import { User } from '../auth/entities/user';
import { SearchRequestDto } from '../search/entities/search-request.dto';

@Injectable()
export class UploadedDocumentsService {
  constructor(private readonly orpDal: OrpDal) {}

  async findAll(user: User, pageNumber?: number): Promise<OrpSearchResponse> {
    const searchRequest: SearchRequestDto = { regulators: user.regulator.id };
    const regulatoryMaterial = await this.orpDal.searchOrp(
      searchRequest,
      pageNumber,
    );

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
