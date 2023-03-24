import { IsNotEmpty, IsString } from 'class-validator';

export default class DocumentTopicsDto {
  @IsString()
  key: string;

  @IsNotEmpty({ message: 'Select a document topic' })
  topic1: string;
  topic2: string;
  topic3?: string;
  topic4?: string;
  topic5?: string;
}
