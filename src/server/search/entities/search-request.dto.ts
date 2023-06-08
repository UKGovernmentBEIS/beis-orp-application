import { IsString, ValidateIf } from 'class-validator';
import { DocumentType } from './document-types';
import { DocumentStatus } from './status-types';

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

  topic1?: string;
  topic2?: string;
}
