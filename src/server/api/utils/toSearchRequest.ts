import { ApiSearchRequestDto } from '../types/ApiSearchRequest.dto';
import { SearchRequestDto } from '../../search/types/SearchRequest.dto';

export default (apiSearch: ApiSearchRequestDto): SearchRequestDto => ({
  ...apiSearch,
  docTypes: apiSearch.document_types,
  publishedFromDate: apiSearch.published_from_date,
  publishedToDate: apiSearch.published_to_date,
});
