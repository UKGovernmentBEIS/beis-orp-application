import { IsNotEmpty, IsString } from 'class-validator';
import { OrpDocumentStatus } from '../../search/types/statusTypes';

export default class DocumentStatusDto {
  @IsNotEmpty({
    message: 'Select Yes if it is a draft document or No if it is not',
  })
  status: OrpDocumentStatus;

  @IsString()
  key: string;
}
