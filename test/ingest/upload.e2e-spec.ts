import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getPdfBuffer } from '../mocks/uploadMocks';
import {
  getNonRegulatorSession,
  getRegulatorSession,
} from '../helpers/userSessions';

const mockS3 = {
  send: jest.fn(),
};

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn(() => mockS3),
    PutObjectCommand: jest.fn((args) => ({ ...args, putObjectCommand: true })),
    GetObjectCommand: jest.fn((args) => ({ ...args, getObjectCommand: true })),
  };
});

jest.mock('uuid', () => {
  return { v4: jest.fn(() => 'UUID') };
});
describe('Ingest upload', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;
  let nonRegulatorSession = null;

  beforeAll(async () => {
    await fixture.init();
    regulatorSession = await getRegulatorSession(fixture);
    nonRegulatorSession = await getNonRegulatorSession(fixture);
  });

  describe('upload/ (GET)', () => {
    it('upload/ (GET)', () => {
      return fixture
        .request()
        .get('/ingest/upload')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($("input[name='file'][type='file']").length).toBeTruthy();
        });
    });

    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        return fixture
          .request()
          .get('/ingest/upload')
          .set('Cookie', nonRegulatorSession)
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });

      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .get('/ingest/upload')
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });

  describe('POST', () => {
    it('uploads unconfirmed file', async () => {
      const file = await getPdfBuffer();
      mockS3.send.mockResolvedValueOnce('response');

      return fixture
        .request()
        .post('/ingest/upload')
        .attach('file', file, 'testfile.pdf')
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect(
          'Location',
          '/ingest/document-type?key=unconfirmed/uuid-testfile.pdf',
        );
    });

    it('displays validation error if no file attached', async () => {
      mockS3.send.mockResolvedValueOnce('response');

      return fixture
        .request()
        .post('/ingest/upload')
        .set('Cookie', regulatorSession)
        .expect(400)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('p.govuk-error-message').text().trim()).toEqual(
            'Error: Select a document',
          );
        });
    });

    it('displays validation error if non-pdf file attached', async () => {
      const file = await getPdfBuffer();
      mockS3.send.mockResolvedValueOnce('response');

      return fixture
        .request()
        .post('/ingest/upload')
        .attach('file', file, 'testfile.png')
        .set('Cookie', regulatorSession)
        .expect(400)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('p.govuk-error-message').text().trim()).toEqual(
            'Error: The selected file must be a PDF, Microsoft Word or Open Office document',
          );
        });
    });

    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        const file = await getPdfBuffer();
        mockS3.send.mockResolvedValueOnce('response');

        return fixture
          .request()
          .post('/ingest/upload')
          .attach('file', file, 'testfile.pdf')
          .set('Cookie', nonRegulatorSession)
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });

      it('redirects unauthenticated users', async () => {
        const file = await getPdfBuffer();
        mockS3.send.mockResolvedValueOnce('response');

        return fixture
          .request()
          .post('/ingest/upload')
          .attach('file', file, 'testfile.pdf')
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });
});
