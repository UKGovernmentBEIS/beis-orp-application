import {
  RawOrpResponse,
  RawOrpResponseEntry,
} from '../../src/server/data/types/rawOrpSearchResponse';
import {
  ApiOrpSearchItem,
  ApiSearchResponseDto,
} from '../../src/server/api/types/ApiSearchResponse.dto';
import {
  OrpSearchItem,
  SearchResponseDto,
} from '../../src/server/search/types/SearchResponse.dto';

export const getRawOrpDocument = (
  overrides: Partial<RawOrpResponseEntry> = {},
): RawOrpResponseEntry => {
  return {
    title: 'Title',
    summary: 'This is the summary',
    document_uid: '0001',
    regulator_id: 'ofcom',
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
    document_type: 'GD',
    uri: 'doc.pdf',
    keyword: ['keyword1', 'keyword2'],
    status: 'published',
    ...overrides,
  };
};

export const getMappedOrpDocument = (
  overrides: Partial<OrpSearchItem> = {},
): OrpSearchItem => {
  return {
    title: 'Title',
    description: 'This is the summary',
    documentId: '0001',
    creator: 'Office of Communications',
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
    documentType: 'Guidance',
    keyword: ['keyword1', 'keyword2'],
    status: 'published',
    ...overrides,
  };
};

export const getMappedOrpDocumentForApi = (
  overrides: Partial<ApiOrpSearchItem> = {},
): ApiOrpSearchItem => {
  return {
    title: 'Title',
    description: 'This is the summary',
    document_id: '0001',
    creator: 'Office of Communications',
    dates: {
      uploaded: '2019-08-06T00:00:00Z',
      published: '2018-08-06T00:00:00Z',
    },
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
    document_type: 'Guidance',
    keyword: ['keyword1', 'keyword2'],
    status: 'published',
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
    getRawOrpDocument({ title, document_uid: String(index) }),
  ),
};

export const expectedApiOutputForOrpStandardResponse: ApiSearchResponseDto['regulatory_material'] =
  {
    documents: docTitles.map((title, index) =>
      getMappedOrpDocumentForApi({ title, document_id: String(index) }),
    ),
    total_search_results: 13,
  };

export const expectedInternalOutputForOrpStandardResponse: SearchResponseDto['regulatoryMaterial'] =
  {
    documents: docTitles.map((title, index) =>
      getMappedOrpDocument({ title, documentId: String(index) }),
    ),
    totalSearchResults: 13,
  };
