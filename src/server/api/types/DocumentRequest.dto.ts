import { IsString } from 'class-validator';

export class DocumentRequestDto {
  @IsString()
  id: string;
}
