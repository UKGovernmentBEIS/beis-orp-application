import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getRegulatorSession } from '../helpers/userSessions';

describe('Ingest url: document type', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;

  beforeAll(async () => {
    await fixture.init({
      sessionOverride: { urlIngestion: { uri: 'www.gov.uk' } },
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
        .get('/ingest/url/document-type')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('input[name="documentType"]').length).toEqual(4);
          expect($('button[type="submit"]').text().trim()).toEqual('Continue');
        });
    });

    describe('guards', () => {
      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .get('/ingest/url/document-type')
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });

  describe('POST', () => {
    it('updates the meta data rend redirects to document-topics', async () => {
      return fixture
        .request()
        .post('/ingest/url/document-type')
        .set('Cookie', regulatorSession)
        .send({ documentType: { new: 'meta' } })
        .expect(302)
        .expect('Location', '/ingest/url/document-topics');
    });

    describe('guards', () => {
      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .post('/ingest/url/document-type')
          .send({ documentType: { new: 'meta' } })
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });
});
