import {
  OrpSearchItem,
  OrpSearchResponse,
  SearchResponseDto,
} from '../../search/types/SearchResponse.dto';
import { ApiSearchResponseDto } from '../types/ApiSearchResponse.dto';
import * as snakecaseKeys from 'snakecase-keys';

export default (apiSearch: SearchResponseDto): ApiSearchResponseDto =>
  snakecaseKeys({
    ...apiSearch,
    regulatoryMaterial: toApiRegulatorMaterial(apiSearch.regulatoryMaterial),
  }) as unknown as ApiSearchResponseDto;

export function toApiRegulatorMaterial(regMat: OrpSearchResponse) {
  return snakecaseKeys({
    ...regMat,
    documents: regMat.documents.map(toApiOrpDocument),
  });
}
export function toApiOrpDocument(doc: OrpSearchItem) {
  return snakecaseKeys({
    ...doc,
    uri: undefined,
    documentFormat: undefined,
  });
}
