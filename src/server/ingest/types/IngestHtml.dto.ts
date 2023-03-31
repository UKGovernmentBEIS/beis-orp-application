import { IsNotEmpty } from 'class-validator';
import { IsGovDomain } from '../../validators/isGovDomain';

export default class IngestHtmlDto {
  @IsNotEmpty({
    message: 'Select an option',
  })
  uploadType: 'url' | 'device';

  @IsGovDomain({
    message: 'Enter a url containing .gov.uk domain',
  })
  url: string;
}
