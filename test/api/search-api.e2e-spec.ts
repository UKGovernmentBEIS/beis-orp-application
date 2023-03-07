import { E2eFixture } from '../e2e.fixture';
import { expectedApiOutputForTnaStandardResponse } from '../mocks/tnaSearchMock';
import { expectedApiOutputForOrpStandardResponse } from '../mocks/orpSearchMock';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { TNA_URL } from '../../src/server/data/tna.dal';
import { mockedSearchLambda } from '../mocks/config.mock';

describe('api/search (GET)', () => {
  const fixture = new E2eFixture();

  beforeAll(async () => {
    await fixture.init();
  });

  describe('validation', () => {
    it('returns bad request if both title and keyword is empty', async () => {
      return fixture.request().get('/api/search').send({}).expect(400);
    });

    it('is successful if title is provided', async () => {
      return fixture
        .request()
        .get('/api/search')
        .query({ title: 'title' })
        .expect(200);
    });

    it('is successful if keyword is provided', async () => {
      return fixture
        .request()
        .get('/api/search')
        .query({ keyword: 'keyword' })
        .expect(200);
    });

    it('is successful if keyword and title are provided', async () => {
      return fixture
        .request()
        .get('/api/search')
        .query({ keyword: 'keyword', title: 'title' })
        .expect(200);
    });
  });

  describe('search', () => {
    it('calls the national archives and orp and parses the values', () => {
      return fixture
        .request()
        .get('/api/search')
        .query({ keyword: 'keyword', title: 'title' })
        .expect(200)
        .expect({
          legislation: expectedApiOutputForTnaStandardResponse,
          regulatory_material: expectedApiOutputForOrpStandardResponse,
        });
    });

    it('returns 500 if orp call fails', () => {
      server.use(
        rest.post(mockedSearchLambda, (req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      return fixture
        .request()
        .get('/api/search')
        .query({ keyword: 'keyword', title: 'title' })
        .expect(500)
        .expect('{"statusCode":500,"message":"Internal server error"}');
    });

    it('returns 500 if tna call fails', () => {
      server.use(
        rest.get(TNA_URL, (req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      return fixture
        .request()
        .get('/api/search')
        .query({ keyword: 'keyword', title: 'title' })
        .expect(500)
        .expect('{"statusCode":500,"message":"Internal server error"}');
    });
  });
});
