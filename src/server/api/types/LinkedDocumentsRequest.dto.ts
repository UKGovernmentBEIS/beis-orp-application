import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsLegislationDomain } from '../../validators/isLegislationDomain';

export class LinkedDocumentsRequestDto {
  @IsNotEmpty({ message: 'Hrefs for the legislation is required' })
  @ApiProperty({
    type: [String],
    example: ['http://www.legislation.gov.uk/id/uksi/2012/632'],
    description:
      'HREF for the legislation on legislation.gov.uk. Returned as the id of the document during search',
  })
  @IsLegislationDomain({
    message:
      'The legislation href should be a url from the domain legislation.gov.uk',
  })
  legislation_href: string | string[];
}
