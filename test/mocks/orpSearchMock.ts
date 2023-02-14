import {
  RawOrpResponse,
  RawOrpResponseEntry,
} from '../../src/server/data/types/rawOrpSearchResponse';
import {
  OrpSearchItem,
  SearchResponseDto,
} from '../../src/server/api/types/SearchResponse.dto';

export const getRawDocument = (
  overrides: Partial<RawOrpResponseEntry>,
): RawOrpResponseEntry => {
  return {
    title: 'Title',
    summary: 'This is the summary',
    document_uid: '0001',
    regulator_id: 'reg001',
    s3_uri: '/bucket/doc.pdf',
    date_uploaded: '2019-08-06T00:00:00Z',
    date_published: '2018-08-06T00:00:00Z',
    legislative_origins: [
      {
        url: 'www.lo.com',
        title: 'Lo Title',
        type: 'Lo Type',
        division: 'Lo division',
      },
    ],
    regulatory_topics: ['topic1', 'topic2'],
    version: 1,
    document_type: 'doc type',
    object_key: 'doc.pdf',
    keyword: ['keyword1', 'keyword2'],
    ...overrides,
  };
};

const getMappedDocument = (
  overrides: Partial<OrpSearchItem>,
): OrpSearchItem => {
  return {
    title: 'Title',
    summary: 'This is the summary',
    documentId: '0001',
    regulatorId: 'reg001',
    dates: {
      uploaded: '2019-08-06T00:00:00Z',
      published: '2018-08-06T00:00:00Z',
    },
    legislativeOrigins: [
      {
        url: 'www.lo.com',
        title: 'Lo Title',
        type: 'Lo Type',
        division: 'Lo division',
      },
    ],
    regulatoryTopics: ['topic1', 'topic2'],
    version: 1,
    documentType: 'doc type',
    ...overrides,
  };
};

const docTitles = [
  'Title1',
  'Title2',
  'Title3',
  'Title4',
  'Title5',
  'Title6',
  'Title7',
  'Title8',
  'Title9',
  'Title10',
];

export const orpStandardResponse: RawOrpResponse = {
  total_search_results: 13,
  documents: docTitles.map((title, index) =>
    getRawDocument({ title, document_uid: String(index) }),
  ),
};

export const expectedOutputForOrpStandardResponse: SearchResponseDto['orp'] = {
  documents: docTitles.map((title, index) =>
    getMappedDocument({ title, documentId: String(index) }),
  ),
  totalSearchResults: 13,
};
