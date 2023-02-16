import { IsString, ValidateIf } from 'class-validator';
import { DocumentType } from '../../search/types/documentTypes';
import { DocumentStatus } from '../../search/types/statusTypes';

export class SearchRequestDto {
  @ValidateIf((o) => !o.keyword)
  @IsString()
  title?: string;

  @ValidateIf((o) => !o.title)
  @IsString()
  keyword?: string;

  regulators?: string | string[];

  docTypes?: DocumentType | DocumentType[];

  status?: DocumentStatus | DocumentStatus[];

  publishedFromDate?: string;
  publishedToDate?: string;
}
