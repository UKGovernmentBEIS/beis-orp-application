import { IsString, ValidateIf } from 'class-validator';
import { DocumentType } from '../../search/types/documentTypes';
import { DocumentStatus } from '../../search/types/statusTypes';
import { ApiProperty } from '@nestjs/swagger';
import regulators from '../../regulator/config/regulators';

export class ApiSearchRequestDto {
  @ApiProperty({
    description:
      'Words contained in the title of the document. At least one of title or keyword must be provided',
  })
  @ValidateIf((o) => !o.keyword)
  @IsString()
  title?: string;

  @ApiProperty({
    description:
      'Keywords for the document. At least one of title or keyword must be provided',
  })
  @ValidateIf((o) => !o.title)
  @IsString()
  keyword?: string;

  @ApiProperty({ enum: regulators.map((r) => r.id), isArray: true })
  regulators?: string | string[];

  @ApiProperty({ enum: ['GD', 'MSI', 'HS', 'OTHER'], isArray: true })
  document_types?: DocumentType | DocumentType[];

  @ApiProperty({ enum: ['published', 'draft'], isArray: true })
  status?: DocumentStatus | DocumentStatus[];

  @ApiProperty({
    description:
      'The earliest publish date of the documents in format YYYY-MM-DD',
    format: 'YYYY-MM-DD',
  })
  published_from_date?: string;

  @ApiProperty({
    description:
      'The latest publish date of the documents in format YYYY-MM-DD',
    format: 'YYYY-MM-DD',
  })
  published_to_date?: string;
}
