import { IsString, ValidateIf } from 'class-validator';
import { DocumentType } from '../../search/types/documentTypes';

export class SearchRequestDto {
  @ValidateIf((o) => !o.keyword)
  @IsString()
  title?: string;

  @ValidateIf((o) => !o.title)
  @IsString()
  keyword?: string;

  regulators?: string | string[];

  docTypes?: DocumentType | DocumentType[];
}
