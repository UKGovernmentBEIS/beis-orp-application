import {
  Controller,
  Get,
  Query,
  Render,
  Req,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ErrorFilter } from '../error.filter';
import { SearchService } from './search.service';
import { ViewDataInterceptor } from '../view-data.interceptor';
import { SearchRequestDto } from './entities/search-request.dto';
import { documentTypes } from './entities/document-types';
import { documentStatus } from './entities/status-types';
import { DateTransformPipe } from '../form-validation/date-transform.pipe';
import { topicsDisplayMap } from '../document/utils/topics-display-mapping';
import { topics } from '../document/utils/topics';
import { RegulatorService } from '../regulator/regulator.service';

@UseFilters(ErrorFilter)
@UseInterceptors(ViewDataInterceptor)
@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly regulatorService: RegulatorService,
  ) {}

  @Get('')
  @UsePipes(DateTransformPipe)
  @Render('pages/search')
  async search(@Req() request, @Query() searchRequestDto?: SearchRequestDto) {
    const results =
      searchRequestDto.title || searchRequestDto.keyword
        ? await this.searchService.search(searchRequestDto)
        : null;

    request.session.latestSearch = request.url;

    return {
      searchedValues: searchRequestDto,
      results,
      filters: {
        regulators: this.regulatorService.getRegulators(),
        docTypes: documentTypes,
        statuses: documentStatus,
        topics: Object.keys(topics),
        topicsDisplayMap,
      },
      title: results ? 'Search results' : 'Search for regulatory material',
    };
  }
}
