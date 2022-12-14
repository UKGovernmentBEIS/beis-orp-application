import { E2eFixture } from '../e2e.fixture';
import { expectedOutputForTnaStandardResponse } from '../mocks/tnaSearchMock';
import { expectedOutputForOrpStandardResponse } from '../mocks/orpSearchMock';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { TNA_URL } from '../../src/server/search/tna.dal';
import { mockedSearchLambda } from '../mocks/config.mock';

describe('api/search (GET)', () => {
  const fixture = new E2eFixture();

  beforeEach(async () => {
    await fixture.init();
  });

  describe('validation', () => {
    it('returns bad request if both title and keywords is empty', async () => {
      return fixture.request().get('/api/search').send({}).expect(400);
    });

    it('is successful if title is provided', async () => {
      return fixture
        .request()
        .get('/api/search')
        .query({ title: 'title' })
        .expect(200);
    });

    it('is successful if keywords is provided', async () => {
      return fixture
        .request()
        .get('/api/search')
        .query({ keywords: 'keyword' })
        .expect(200);
    });

    it('is successful if keywords and title are provided', async () => {
      return fixture
        .request()
        .get('/api/search')
        .query({ keywords: 'keyword', title: 'title' })
        .expect(200);
    });
  });

  describe('tna search', () => {
    it('calls the national archives and parses the xml returning first 10 items', () => {
      return fixture
        .request()
        .get('/api/search')
        .query({ keywords: 'keyword', title: 'title' })
        .expect(200)
        .expect({
          nationalArchive: expectedOutputForTnaStandardResponse,
          orp: expectedOutputForOrpStandardResponse,
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
        .query({ keywords: 'keyword', title: 'title' })
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
        .query({ keywords: 'keyword', title: 'title' })
        .expect(500)
        .expect('{"statusCode":500,"message":"Internal server error"}');
    });
  });
});
