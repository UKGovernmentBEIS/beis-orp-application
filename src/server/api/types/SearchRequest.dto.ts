import { IsString, ValidateIf } from 'class-validator';

export class SearchRequestDto {
  @ValidateIf((o) => !o.keywords)
  @IsString()
  title?: string;

  @ValidateIf((o) => !o.title)
  @IsString()
  keywords?: string;
}
