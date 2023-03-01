import { LinkedDocumentsResponseDto } from '../../src/server/search/types/LinkedDocumentsResponse.dto';
import { RawLinkedDocumentsResponse } from '../../src/server/data/types/rawOrpSearchResponse';
import { ApiLinkedDocumentsResponseDto } from '../../src/server/api/types/ApiLinkedDocumentsResponse.dto';

export const linkedDocsRawResponse: RawLinkedDocumentsResponse = {
  status_description: 'OK',
  status_code: 200,
  documents: [
    {
      related_docs: [
        {
          summary: 'Summary 1',
          date_published: '2017-09-01T00:00:00',
          date_uploaded: '2022-12-13T11:13:37',
          document_uid: '39647bbd437d4d85ac64b3f2e0417abb',
          keyword: ['clean'],
          title: 'Title 1',
          uri: '39647bbd437d4d85ac64b3f2e0417abb.pdf',
          version: 1,
          document_type: 'GD',
        },
        {
          summary: 'Summary 2',
          date_published: '2021-07-01T00:00:00',
          date_uploaded: '2022-12-13T11:13:38',
          document_uid: '616971a3eecf47d18d323151ccc49b67',
          keyword: ['license'],
          title: 'Title 2',
          uri: '616971a3eecf47d18d323151ccc49b67.pdf',
          version: 1,
          document_type: 'GD',
        },
      ],
      legislation_href: 'http://www.legislation.gov.uk/id/uksi/2012/632',
    },
  ],
  total_search_results: 1,
};

export const expectedInternalOutputForLinkedDocs: LinkedDocumentsResponseDto = {
  totalSearchResults: 1,
  documents: [
    {
      relatedDocuments: [
        {
          description: 'Summary 1',
          dates: {
            published: '2017-09-01T00:00:00',
            uploaded: '2022-12-13T11:13:37',
          },
          documentId: '39647bbd437d4d85ac64b3f2e0417abb',
          keyword: ['clean'],
          title: 'Title 1',
          version: 1,
          documentType: 'Guidance',
        },
        {
          description: 'Summary 2',
          dates: {
            published: '2021-07-01T00:00:00',
            uploaded: '2022-12-13T11:13:38',
          },
          documentId: '616971a3eecf47d18d323151ccc49b67',
          keyword: ['license'],
          title: 'Title 2',
          version: 1,
          documentType: 'Guidance',
        },
      ],
      legislationHref: 'http://www.legislation.gov.uk/id/uksi/2012/632',
    },
  ],
};

export const expectedApiOutputForLinkedDocs: ApiLinkedDocumentsResponseDto = {
  total_search_results: 1,
  documents: [
    {
      related_documents: [
        {
          description: 'Summary 1',
          dates: {
            published: '2017-09-01T00:00:00',
            uploaded: '2022-12-13T11:13:37',
          },
          document_id: '39647bbd437d4d85ac64b3f2e0417abb',
          keyword: ['clean'],
          title: 'Title 1',
          version: 1,
          document_type: 'Guidance',
        },
        {
          description: 'Summary 2',
          dates: {
            published: '2021-07-01T00:00:00',
            uploaded: '2022-12-13T11:13:38',
          },
          document_id: '616971a3eecf47d18d323151ccc49b67',
          keyword: ['license'],
          title: 'Title 2',
          version: 1,
          document_type: 'Guidance',
        },
      ],
      legislation_href: 'http://www.legislation.gov.uk/id/uksi/2012/632',
    },
  ],
};
