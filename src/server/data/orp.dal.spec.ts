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

describe('Orp data access layer', () => {
  let orpDal: OrpDal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrpDal, mockConfigService, mockLogger],
      imports: [HttpModule],
    }).compile();

    orpDal = module.get<OrpDal>(OrpDal);
  });

  it('should search the orp db and map object with top 10 entries', async () => {
    expect(await orpDal.searchOrp('a', 'b')).toMatchObject(
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

    expect(await orpDal.searchOrp('a', 'b')).toMatchObject({
      totalSearchResults: 0,
      documents: [],
    });
  });
});
