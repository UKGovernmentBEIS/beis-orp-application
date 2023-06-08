import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../search/entities/document-types';
import { OrpDocumentStatus } from '../../search/entities/status-types';
import { IsIn } from 'class-validator';
import { IsEndOfTopicPathValidator } from '../../validators/is-end-of-topic-path.validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ enum: ['GD', 'MSI', 'HS', 'OTHER'] })
  @IsIn(['GD', 'MSI', 'HS', 'OTHER'])
  document_type: DocumentType | 'OTHER';

  @ApiProperty({ enum: ['published', 'draft'] })
  @IsIn(['draft', 'published'])
  status: OrpDocumentStatus;

  @IsEndOfTopicPathValidator({
    message: 'topics must be end of a complete topic branch',
  })
  topics: string;
}
