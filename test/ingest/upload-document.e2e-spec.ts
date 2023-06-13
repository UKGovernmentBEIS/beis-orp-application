import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getPdfBuffer } from '../mocks/uploadMocks';
import { getRegulatorSession } from '../helpers/userSessions';

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
describe('Ingest document', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;

  beforeAll(async () => {
    await fixture.init();
    regulatorSession = await getRegulatorSession(fixture);
  });

  describe('ingest/document', () => {
    it('starts ingestion flow', async () => {
      return fixture
        .request()
        .post('/ingest/upload')
        .send({
          uploadType: 'document',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/url');
    });

    it('upload/ (GET)', () => {
      return fixture
        .request()
        .get('/ingest/document')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($("input[name='file'][type='file']").length).toBeTruthy();
        });
    });

    describe('guards', () => {
      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .get('/ingest/document')
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });

  describe('POST', () => {
    it('uploads unconfirmed pdf', async () => {
      const file = await getPdfBuffer();
      mockS3.send.mockResolvedValueOnce('response');

      return fixture
        .request()
        .post('/ingest/document')
        .attach('file', file, 'testfile.pdf')
        .field({
          uploadType: 'device',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect(
          'Location',
          '/ingest/document/document-type?key=unconfirmed/uuid-testfile.pdf',
        );
    });

    it('uploads unconfirmed .docx', async () => {
      const file = await getPdfBuffer('DOCX');
      mockS3.send.mockResolvedValueOnce('response');

      return fixture
        .request()
        .post('/ingest/document')
        .attach('file', file, 'testfile.docx')
        .field({
          uploadType: 'device',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect(
          'Location',
          '/ingest/document/document-type?key=unconfirmed/uuid-testfile.docx',
        );
    });

    it('uploads unconfirmed .odt', async () => {
      const file = await getPdfBuffer('ODT');
      mockS3.send.mockResolvedValueOnce('response');

      return fixture
        .request()
        .post('/ingest/document')
        .attach('file', file, 'testfile.odt')
        .field({
          uploadType: 'device',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect(
          'Location',
          '/ingest/document/document-type?key=unconfirmed/uuid-testfile.odt',
        );
    });

    it('redirects back if no file attached', async () => {
      mockS3.send.mockResolvedValueOnce('response');

      return fixture
        .request()
        .post('/ingest/document')
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/document');
    });

    it('redirects back if empty pdf attached', async () => {
      const file = await getPdfBuffer('EMPTY_PDF');
      mockS3.send.mockResolvedValueOnce('response');

      return fixture
        .request()
        .post('/ingest/document')
        .attach('file', file, 'emptypdf.pdf')
        .field({
          uploadType: 'device',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/document');
    });

    it('redirects back if empty .docx attached', async () => {
      const file = await getPdfBuffer('EMPTY_DOCX');
      mockS3.send.mockResolvedValueOnce('response');

      return fixture
        .request()
        .post('/ingest/document')
        .attach('file', file, 'emptypdf.docx')
        .field({
          uploadType: 'device',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/document');
    });

    it('redirects back if empty .odt attached', async () => {
      const file = await getPdfBuffer('EMPTY_ODT');
      mockS3.send.mockResolvedValueOnce('response');

      return fixture
        .request()
        .post('/ingest/document')
        .attach('file', file, 'emptypdf.odt')
        .field({
          uploadType: 'device',
        })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/document');
    });

    it('redirects back if unsupported file type attached', async () => {
      const file = await getPdfBuffer();
      mockS3.send.mockResolvedValueOnce('response');

      return fixture
        .request()
        .post('/ingest/document')
        .attach('file', file, 'testfile.png')
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/ingest/document');
    });

    describe('guards', () => {
      it('redirects unauthenticated users', async () => {
        const file = await getPdfBuffer();
        mockS3.send.mockResolvedValueOnce('response');

        return fixture
          .request()
          .post('/ingest/document')
          .attach('file', file, 'testfile.pdf')
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });
});
