import { IsGovDomainValidator } from '../../validators/is-gov-domain.validator';

export default class IngestHtmlDto {
  @IsGovDomainValidator({
    message: 'Enter a url containing .gov.uk domain',
  })
  url: string;
}
