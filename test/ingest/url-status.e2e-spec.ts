import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getRegulatorSession } from '../helpers/userSessions';
import { FULL_TOPIC_PATH } from '../mocks/topics';

describe('Ingest url: status', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;

  beforeAll(async () => {
    await fixture.init({
      sessionOverride: {
        urlIngestion: {
          uri: 'www.gov.uk',
          topics: JSON.stringify(FULL_TOPIC_PATH),
        },
      },
    });
    regulatorSession = await getRegulatorSession(fixture);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('displays the options', () => {
      return fixture
        .request()
        .get('/ingest/url/document-status')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('input[name="status"]').length).toEqual(2);
          expect($('button[type="submit"]').text().trim()).toEqual('Continue');
        });
    });

    describe('guards', () => {
      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .get('/ingest/url/document-status')
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });

  describe('POST', () => {
    it('updates and redirects to submit page', async () => {
      return fixture
        .request()
        .post('/ingest/url/document-status')
        .set('Cookie', regulatorSession)
        .send({ status: 'published' })
        .expect(302)
        .expect('Location', '/ingest/url/submit');
    });

    describe('guards', () => {
      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .post('/ingest/url/document-status')
          .send({ key: 'unconfirmed/key', status: 'published' })
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });
});
