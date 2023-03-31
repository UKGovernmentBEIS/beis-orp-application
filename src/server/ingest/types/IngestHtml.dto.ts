import { IsNotEmpty } from 'class-validator';

export default class IngestHtmlDto {
  @IsNotEmpty({
    message: 'Select an option',
  })
  uploadType: 'url' | 'device';

  @IsNotEmpty({ message: 'Provide a url with a .gov.uk domain' })
  url: string;
}
