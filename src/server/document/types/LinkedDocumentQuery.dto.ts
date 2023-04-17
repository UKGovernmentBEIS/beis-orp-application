import { IsOptional } from 'class-validator';
import { IsLegislationDomain } from '../../validators/isLegislationDomain';

export class LinkedDocumentQueryDto {
  @IsLegislationDomain({
    message: 'The ID should be a url from the domain legislation.gov.uk',
  })
  id: string;

  @IsOptional()
  published: string;
}
