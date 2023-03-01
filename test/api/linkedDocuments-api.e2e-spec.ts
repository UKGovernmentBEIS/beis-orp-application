import { E2eFixture } from '../e2e.fixture';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { mockedSearchLambda } from '../mocks/config.mock';
import {
  expectedApiOutputForLinkedDocs,
  linkedDocsRawResponse,
} from '../mocks/linkedDocumentsMock';

describe('api/search (GET)', () => {
  const fixture = new E2eFixture();

  beforeAll(async () => {
    await fixture.init();
  });

  beforeEach(() => {
    server.use(
      rest.post(mockedSearchLambda, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(linkedDocsRawResponse));
      }),
    );
  });

  afterAll(() => {
    fixture.tearDown();
  });

  describe('validation', () => {
    it('returns bad request if no hrefs', async () => {
      return fixture
        .request()
        .post('/api/linked-documents')
        .send({})
        .expect(400);
    });

    it('is successful if legislation_href is provided as string', async () => {
      return fixture
        .request()
        .post('/api/linked-documents')
        .send({ legislation_href: 'href' })
        .expect(200);
    });

    it('is successful if legislation_href is provided as list', async () => {
      return fixture
        .request()
        .post('/api/linked-documents')
        .send({ legislation_href: ['href', 'href2'] })
        .expect(200);
    });
  });

  describe('search', () => {
    it('calls the orp and parses the values', () => {
      return fixture
        .request()
        .post('/api/linked-documents')
        .send({ legislation_href: ['href', 'href2'] })
        .expect(200)
        .expect(expectedApiOutputForLinkedDocs);
    });

    it('returns 500 if orp call fails', () => {
      server.use(
        rest.post(mockedSearchLambda, (req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      return fixture
        .request()
        .post('/api/linked-documents')
        .send({ legislation_href: ['href', 'href2'] })
        .expect(500)
        .expect('{"statusCode":500,"message":"Internal server error"}');
    });
  });
});
