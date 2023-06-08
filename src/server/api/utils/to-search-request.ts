import { ApiSearchRequestDto } from '../entities/api-search-request.dto';
import { SearchRequestDto } from '../../search/entities/search-request.dto';

export default (apiSearch: ApiSearchRequestDto): SearchRequestDto => ({
  ...apiSearch,
  docTypes: apiSearch.document_types,
  publishedFromDate: apiSearch.published_from_date,
  publishedToDate: apiSearch.published_to_date,
});
