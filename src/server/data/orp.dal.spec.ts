import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { rest } from 'msw';
import { server } from '../../../test/mocks/server';
import { OrpDal } from './orp.dal';
import { expectedOutputForOrpStandardResponse } from '../../../test/mocks/orpSearchMock';
import {
  mockConfigService,
  mockedSearchLambda,
} from '../../../test/mocks/config.mock';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { searchMock } from '../../../test/mocks/handlers';

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

  it('should search the orp db and map object with top 10 entries', async () => {
    expect(await orpDal.searchOrp({ title: 'a', keyword: 'b' })).toMatchObject(
      expectedOutputForOrpStandardResponse,
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

    expect(await orpDal.searchOrp({ title: 'a', keyword: 'b' })).toMatchObject({
      totalSearchResults: 0,
      documents: [],
    });
  });

  describe('regulator_id', () => {
    it('should map regulators to regulator_id', async () => {
      await orpDal.searchOrp({ title: 'a', keyword: 'b', regulators: ['id'] });
      expect(searchMock).toBeCalledWith({
        title: 'a',
        keyword: 'b',
        regulator_id: ['id'],
      });
    });

    it('should ensure regulator_id is an array', async () => {
      await orpDal.searchOrp({ title: 'a', keyword: 'b', regulators: 'id' });
      expect(searchMock).toBeCalledWith({
        title: 'a',
        keyword: 'b',
        regulator_id: ['id'],
      });
    });

    it('should handle no regulators', async () => {
      await orpDal.searchOrp({ title: 'a', keyword: 'b', regulators: '' });
      expect(searchMock).toBeCalledWith({
        title: 'a',
        keyword: 'b',
        regulator_id: undefined,
      });
    });

    it('should handle no regulators as array', async () => {
      await orpDal.searchOrp({ title: 'a', keyword: 'b', regulators: [] });
      expect(searchMock).toBeCalledWith({
        title: 'a',
        keyword: 'b',
        regulator_id: undefined,
      });
    });
  });
});
