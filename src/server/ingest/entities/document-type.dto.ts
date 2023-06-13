import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DocumentType } from '../../search/entities/document-types';

export default class DocumentTypeDto {
  @IsNotEmpty({ message: 'Select a document type' })
  documentType: DocumentType | 'OTHER';

  @IsOptional()
  @IsString()
  key?: string;
}
