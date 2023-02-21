import { IsNotEmpty, IsString } from 'class-validator';
import { DocumentType } from '../../search/types/documentTypes';

export default class DocumentTypeDto {
  @IsNotEmpty({ message: 'Select a document type' })
  documentType: DocumentType | 'OTHER';

  @IsString()
  key: string;
}
