import { IsOptional } from 'class-validator';
import { IsLegislationDomainValidator } from '../../validators/is-legislation-domain.validator';

export class LinkedDocumentQueryDto {
  @IsLegislationDomainValidator({
    message: 'The ID should be a url from the domain legislation.gov.uk',
  })
  id: string;

  @IsOptional()
  published: string;
}
