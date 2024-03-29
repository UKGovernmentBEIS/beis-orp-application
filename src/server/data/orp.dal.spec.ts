import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { rest } from 'msw';
import { server } from '../../../test/mocks/server';
import { OrpDal } from './orp.dal';
import { orpStandardResponse } from '../../../test/mocks/orpSearchMock';
import {
  mockConfigService,
  mockedSearchLambda,
} from '../../../test/mocks/config.mock';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { searchMock } from '../../../test/mocks/handlers';
import { OrpSearchBody } from './entities/orp-search-requests';
import { SearchRequestDto } from '../search/entities/search-request.dto';
import { DEFAULT_USER_WITH_REGULATOR } from '../../../test/mocks/user.mock';
import { FULL_TOPIC_PATH } from '../../../test/mocks/topics';

describe('Orp data access layer', () => {
  let orpDal: OrpDal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrpDal, mockConfigService, mockLogger],
      imports: [HttpModule],
    }).compile();

    orpDal = module.get<OrpDal>(OrpDal);

    jest.clearAllMocks();
  });

  it('should search the orp db and return raw response', async () => {
    expect(await orpDal.searchOrp({ title: 'a', keyword: 'b' })).toMatchObject(
      orpStandardResponse,
    );
  });

  it('should handle response with no entries', async () => {
    server.use(
      rest.post(mockedSearchLambda, (req, res, ctx) => {
        return res(
          ctx.json({
            total_search_results: 0,
            documents: [],
          }),
        );
      }),
    );
  });

  describe('mapping', () => {
    const SEARCH_REQ: SearchRequestDto = {
      title: 'a',
      keyword: 'b',
      docTypes: ['GD', 'MSI'],
      regulators: ['id', 'id2'],
      status: ['active', 'draft'],
      publishedFromDate: '1985-03-12',
      publishedToDate: '1986-03-12',
      topic1: '/topic',
      topic2: '/topic/topic2',
    };

    const SEARCH_RES: OrpSearchBody = {
      title: 'a',
      keyword: 'b',
      regulator_id: ['id', 'id2'],
      document_type: ['GD', 'MSI'],
      status: ['published', 'draft'],
      date_published: {
        start_date: '1985-03-12',
        end_date: '1986-03-12',
      },
      regulatory_topic: '/topic/topic2',
      page_size: 10,
    };

    it('should map to required lambda format', async () => {
      await orpDal.searchOrp(SEARCH_REQ);
      expect(searchMock).toBeCalledWith(SEARCH_RES);
    });

    it('should ensure regulator_id is an array', async () => {
      await orpDal.searchOrp({ ...SEARCH_REQ, regulators: 'id' });
      expect(searchMock).toBeCalledWith({
        ...SEARCH_RES,
        regulator_id: ['id'],
      });
    });

    it('should ensure document_type is an array', async () => {
      await orpDal.searchOrp({ ...SEARCH_REQ, docTypes: 'GD' });
      expect(searchMock).toBeCalledWith({
        ...SEARCH_RES,
        document_type: ['GD'],
      });
    });

    it('should ensure status is an array', async () => {
      await orpDal.searchOrp({ ...SEARCH_REQ, status: 'active' });
      expect(searchMock).toBeCalledWith({
        ...SEARCH_RES,
        status: ['published'],
      });
    });

    it('should handle no regulators and docTypes and status', async () => {
      await orpDal.searchOrp({ title: 'a', keyword: 'b' });
      expect(searchMock).toBeCalledWith({
        title: 'a',
        keyword: 'b',
        regulator_id: undefined,
        document_types: undefined,
        status: undefined,
        date_published: {},
        page_size: 10,
      });
    });

    it('should use topic 1 if there is no topic 2', async () => {
      await orpDal.searchOrp({
        ...SEARCH_REQ,
        topic1: '/topic',
        topic2: undefined,
      });
      expect(searchMock).toBeCalledWith({
        ...SEARCH_RES,
        regulatory_topic: '/topic',
      });
    });
  });

  describe('ingestUrl', () => {
    it('should send the search response', async () => {
      const payload = {
        document_type: 'GD',
        status: 'draft',
        topics: JSON.stringify(FULL_TOPIC_PATH),
        uri: 'www.gov.uk',
        user_id: DEFAULT_USER_WITH_REGULATOR.cognitoUsername,
        regulator_id: DEFAULT_USER_WITH_REGULATOR.regulator.id,
        uuid: 'UUID',
      };

      expect(await orpDal.ingestUrl(payload)).toEqual('UUID');
    });
  });

  describe('deleteDocument', () => {
    it('should send the delete request', async () => {
      expect(
        await orpDal.deleteDocument(
          'uuid',
          DEFAULT_USER_WITH_REGULATOR.regulator.id,
        ),
      ).toEqual({ status_description: 'OK', status_code: 200 });
    });
  });
});
