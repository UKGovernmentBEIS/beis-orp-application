import { IsNotEmpty } from 'class-validator';

export class LinkedDocumentsRequestDto {
  @IsNotEmpty({ message: 'Hrefs for the legislation is required' })
  legislation_href: string | string[];
}
