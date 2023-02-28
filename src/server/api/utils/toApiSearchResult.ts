import { SearchResponseDto } from '../../search/types/SearchResponse.dto';
import { ApiSearchResponseDto } from '../types/ApiSearchResponse.dto';
import * as snakecaseKeys from 'snakecase-keys';

export default (apiSearch: SearchResponseDto): ApiSearchResponseDto =>
  snakecaseKeys(apiSearch) as unknown as ApiSearchResponseDto;
