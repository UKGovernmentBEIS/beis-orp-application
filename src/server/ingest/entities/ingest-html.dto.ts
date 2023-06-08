import { IsNotEmpty } from 'class-validator';
import { IsGovDomainValidator } from '../../validators/is-gov-domain.validator';

export default class IngestHtmlDto {
  @IsNotEmpty({
    message: 'Select an option',
  })
  uploadType: 'url' | 'device';

  @IsGovDomainValidator({
    message: 'Enter a url containing .gov.uk domain',
  })
  url: string;
}
