import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../search/types/documentTypes';
import { OrpDocumentStatus } from '../../search/types/statusTypes';
import { IsIn } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @IsIn(['GD', 'MSI', 'HS', 'OTHER'])
  document_type: DocumentType | 'OTHER';

  @IsIn(['draft', 'published'])
  status: OrpDocumentStatus;
}
