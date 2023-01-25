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

@UseFilters(new ErrorFilter())
@UseInterceptors(ViewDataInterceptor)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('')
  @Render('pages/search')
  async search(
    @Query() { title, keyword }: { title?: string; keyword?: string },
  ) {
    const results =
      title || keyword
        ? await this.searchService.searchForView(title, keyword)
        : null;

    return { title, keyword, results };
  }
}
