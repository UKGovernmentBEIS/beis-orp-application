import { IsString, ValidateIf } from 'class-validator';
import { DocumentType } from '../../search/types/documentTypes';
import { DocumentStatus } from '../../search/types/statusTypes';

export class ApiSearchRequestDto {
  @ValidateIf((o) => !o.keyword)
  @IsString()
  title?: string;

  @ValidateIf((o) => !o.title)
  @IsString()
  keyword?: string;

  regulators?: string | string[];

  document_types?: DocumentType | DocumentType[];

  status?: DocumentStatus | DocumentStatus[];

  published_from_date?: string;
  published_to_date?: string;
}
