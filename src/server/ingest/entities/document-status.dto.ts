import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrpDocumentStatus } from '../../search/entities/status-types';

export default class DocumentStatusDto {
  @IsNotEmpty({
    message: 'Select Yes if it is a draft document or No if it is not',
  })
  status: OrpDocumentStatus;

  @IsString()
  @IsOptional()
  key?: string;
}
