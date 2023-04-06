import { E2eFixture } from '../e2e.fixture';
import {
  getNonRegulatorSession,
  getRegulatorSession,
} from '../helpers/userSessions';

describe('Ingest url upload', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;
  let nonRegulatorSession = null;

  beforeAll(async () => {
    await fixture.init();
    regulatorSession = await getRegulatorSession(fixture);
    nonRegulatorSession = await getNonRegulatorSession(fixture);
  });

  describe('ingest-html POST', () => {
    it('starts ingestion flow', async () => {
      return fixture
        .request()
        .post('/ingest/ingest-html')
        .send({
          uploadType: 'url',
          url: 'www.gov.uk',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/document-type?key=url');
    });

    it('accepts protocols ingestion flow', async () => {
      return fixture
        .request()
        .post('/ingest/ingest-html')
        .send({
          uploadType: 'url',
          url: 'https://www.gov.uk',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/document-type?key=url');
    });

    it('redirects back if invalid URL', async () => {
      return fixture
        .request()
        .post('/ingest/ingest-html')
        .send({
          uploadType: 'url',
          url: 'www.govuk',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/upload');
    });

    it('redirects back if not gov URL', async () => {
      return fixture
        .request()
        .post('/ingest/ingest-html')
        .send({
          uploadType: 'url',
          url: 'www.google.com',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/upload');
    });

    it('redirects back if no upload type', async () => {
      return fixture
        .request()
        .post('/ingest/ingest-html')
        .send({
          uploadType: '',
          url: 'www.gov.uk',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/upload');
    });

    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        return fixture
          .request()
          .post('/ingest/ingest-html')
          .send({
            uploadType: 'url',
            url: 'www.gov.uk',
          })
          .set('Cookie', nonRegulatorSession)
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });

      it('redirects unauthenticated users', async () => {
        return fixture
          .request()
          .post('/ingest/ingest-html')
          .send({
            uploadType: 'url',
            url: 'www.gov.uk',
          })
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });
});
