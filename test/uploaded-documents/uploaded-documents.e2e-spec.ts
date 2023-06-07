import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getRegulatorSession } from '../helpers/userSessions';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { mockedSearchLambda } from '../mocks/config.mock';
import { orpStandardResponse } from '../mocks/orpSearchMock';

describe('uploaded-documents', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;

  beforeAll(async () => {
    await fixture.init();
    regulatorSession = await getRegulatorSession(fixture);
  });

  describe('findAll', () => {
    it('displays list of documents that has been uploaded by regulator', () => {
      return fixture
        .request()
        .get('/uploaded-documents')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('ul#uploaded-documents-results>li').length).toEqual(10);
          expect(
            $('ul#uploaded-documents-results>li:first > h2').text().trim(),
          ).toEqual('Title1');
        });
    });

    it('displays pagination links', () => {
      server.use(
        rest.post(mockedSearchLambda, (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              ...orpStandardResponse,
              total_search_results: 100,
            }),
          );
        }),
      );
      return fixture
        .request()
        .get('/uploaded-documents?page=5')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('div.govuk-pagination__prev').length).toEqual(1);
          expect($('div.govuk-pagination__next').length).toEqual(1);
          expect($('li.govuk-pagination__item>a.govuk-link').length).toEqual(5);
          expect(
            $('li.govuk-pagination__item.govuk-pagination__item--ellipses')
              .length,
          ).toEqual(2);
        });
    });

    describe('guards', () => {
      it('redirects unauthenticated users', async () => {
        return fixture
          .request()
          .get('/uploaded-documents')
          .expect(302)
          .expect('Location', '/auth/logout');
      });
    });
  });
});
