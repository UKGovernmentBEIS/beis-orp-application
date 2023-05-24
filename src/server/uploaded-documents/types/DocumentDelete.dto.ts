import { IsNotEmpty } from 'class-validator';

export default class DocumentDeleteDto {
  @IsNotEmpty({
    message: 'Provide a document ID',
  })
  id: string;
}
