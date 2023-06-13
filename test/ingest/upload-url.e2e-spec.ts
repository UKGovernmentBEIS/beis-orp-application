import { E2eFixture } from '../e2e.fixture';
import { getRegulatorSession } from '../helpers/userSessions';
import * as cheerio from 'cheerio';

describe('Ingest url', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;

  beforeAll(async () => {
    await fixture.init();
    regulatorSession = await getRegulatorSession(fixture);
  });

  describe('ingest/url', () => {
    it('starts ingestion flow', async () => {
      return fixture
        .request()
        .post('/ingest/upload')
        .send({
          uploadType: 'url',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/url');
    });

    it('redirects back if no upload type', async () => {
      return fixture
        .request()
        .post('/ingest/upload')
        .send({
          uploadType: '',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/upload');
    });

    it('shows url upload form', async () => {
      return fixture
        .request()
        .get('/ingest/url')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect(
            $("form[method='post'] input[name='url']").length,
          ).toBeTruthy();
        });
    });

    it('redirects to document-type page', async () => {
      return fixture
        .request()
        .post('/ingest/url')
        .send({
          url: 'www.gov.uk',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/url/document-type');
    });

    it('redirects back if invalid URL', async () => {
      return fixture
        .request()
        .post('/ingest/url')
        .send({
          url: 'www.govuk',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/url');
    });

    it('redirects back if not gov URL', async () => {
      return fixture
        .request()
        .post('/ingest/url')
        .send({
          url: 'www.google.com',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/url');
    });

    describe('guards', () => {
      it('redirects unauthenticated users', async () => {
        return fixture
          .request()
          .post('/ingest/url')
          .send({
            url: 'www.gov.uk',
          })
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });
});
