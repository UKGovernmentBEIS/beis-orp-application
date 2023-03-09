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
import { ViewDataInterceptor } from '../../view-data-interceptor.service';
import { SearchRequestDto } from './types/SearchRequest.dto';
import { documentTypes } from './types/documentTypes';
import { documentStatus } from './types/statusTypes';
import { DateTransformPipe } from '../form-validation/date-transform.pipe';
import regulators from '../regulator/config/regulators';

@UseFilters(ErrorFilter)
@UseInterceptors(ViewDataInterceptor)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('')
  @UsePipes(DateTransformPipe)
  @Render('pages/search')
  async search(@Req() request, @Query() searchRequestDto?: SearchRequestDto) {
    const results =
      searchRequestDto.title || searchRequestDto.keyword
        ? await this.searchService.searchForView(searchRequestDto)
        : null;

    request.session.latestSearch = request.url;

    return {
      searchedValues: searchRequestDto,
      results,
      filters: {
        regulators,
        docTypes: documentTypes,
        statuses: documentStatus,
      },
    };
  }
}
