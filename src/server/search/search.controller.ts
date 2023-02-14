import {
  Controller,
  Get,
  Query,
  Render,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ErrorFilter } from '../error.filter';
import { SearchService } from './search.service';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';
import { RegulatorService } from '../regulator/regulator.service';
import { SearchRequestDto } from '../api/types/SearchRequest.dto';

@UseFilters(ErrorFilter)
@UseInterceptors(ViewDataInterceptor)
@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly regulatorService: RegulatorService,
  ) {}

  @Get('')
  @Render('pages/search')
  async search(
    @Query()
    searchRequestDto?: SearchRequestDto,
  ) {
    const results =
      searchRequestDto.title || searchRequestDto.keyword
        ? await this.searchService.searchForView(searchRequestDto)
        : null;

    const allRegulators = await this.regulatorService.getRegulators();

    return {
      searchedValues: searchRequestDto,
      results,
      filters: { regulators: allRegulators },
    };
  }
}
