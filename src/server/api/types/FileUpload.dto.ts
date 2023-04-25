import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../search/types/documentTypes';
import { OrpDocumentStatus } from '../../search/types/statusTypes';
import { IsIn } from 'class-validator';
import { IsEndOfTopicPath } from '../../validators/isEndOfTopicPath';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ enum: ['GD', 'MSI', 'HS', 'OTHER'] })
  @IsIn(['GD', 'MSI', 'HS', 'OTHER'])
  document_type: DocumentType | 'OTHER';

  @ApiProperty({ enum: ['published', 'draft'] })
  @IsIn(['draft', 'published'])
  status: OrpDocumentStatus;

  @IsEndOfTopicPath({
    message: 'topics must be end of a complete topic branch',
  })
  topics: string;
}
