import { E2eFixture } from '../e2e.fixture';
import { getRegulatorSession } from '../helpers/userSessions';

describe('Ingest url upload', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;

  beforeAll(async () => {
    await fixture.init();
    regulatorSession = await getRegulatorSession(fixture);
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
