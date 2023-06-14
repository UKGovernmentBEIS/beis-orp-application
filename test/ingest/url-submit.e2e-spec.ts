import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getRegulatorSession } from '../helpers/userSessions';
import { FULL_TOPIC_PATH } from '../mocks/topics';

describe('Ingest url: submit', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;

  beforeAll(async () => {
    await fixture.init({
      sessionOverride: {
        urlIngestion: {
          uri: 'www.gov.uk',
          topics: FULL_TOPIC_PATH,
          status: 'draft',
          document_type: 'other',
        },
      },
    });
    regulatorSession = await getRegulatorSession(fixture);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('gets a the meta and displays the filename', () => {
      return fixture
        .request()
        .get('/ingest/url/submit')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          const allValues = $('dd.govuk-summary-list__value');
          expect($(allValues.get(0)).text().trim()).toEqual('www.gov.uk');
          expect($(allValues.get(1)).text().trim()).toEqual('Other');
          expect($('button[type="submit"]').text().trim()).toEqual('Upload');
        });
    });

    describe('guards', () => {
      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .get('/ingest/url/submit')
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });

  describe('POST', () => {
    describe('guards', () => {
      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .post('/ingest/url/submit')
          .send({ key: 'unconfirmed/key' })
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });
});
