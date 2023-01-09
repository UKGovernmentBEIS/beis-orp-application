import { Controller, Get, Query, Render, UseFilters } from '@nestjs/common';
import { ErrorFilter } from '../error.filter';
import { SearchService } from './search.service';

@UseFilters(new ErrorFilter())
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('')
  @Render('pages/search')
  async search(
    @Query() { title, keyword }: { title?: string; keyword?: string },
  ) {
    const results =
      title || keyword ? await this.searchService.search(title, keyword) : null;

    return { title, keyword, results };
  }
}
