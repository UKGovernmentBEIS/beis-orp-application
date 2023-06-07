import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getRegulatorSession } from '../helpers/userSessions';

const mockS3 = {
  send: jest.fn(),
};
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn(() => mockS3),
    DeleteObjectCommand: jest.fn((args) => ({
      ...args,
      deleteObjectCommand: true,
    })),
    CopyObjectCommand: jest.fn((args) => ({
      ...args,
      copyObjectCommand: true,
    })),
    GetObjectCommand: jest.fn((args) => ({ ...args, getObjectCommand: true })),
    HeadObjectCommand: jest.fn((args) => ({
      ...args,
      headObjectCommand: true,
    })),
  };
});

describe('uploaded-documents/document-type', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;

  beforeAll(async () => {
    await fixture.init();
    regulatorSession = await getRegulatorSession(fixture);
  });

  describe('GET /document-type/:id', () => {
    it('displays detail of document', () => {
      return fixture
        .request()
        .get('/uploaded-documents/document-type/id')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('input[name="documentType"]').length).toEqual(4);
          expect($('button[type="submit"]').text().trim()).toEqual('Update');
          expect(
            $('input[type="hidden"][value="doc.pdf"][name="key"]').length,
          ).toBeTruthy();
        });
    });

    describe('guards', () => {
      it('redirects unauthenticated users', async () => {
        return fixture
          .request()
          .get('/uploaded-documents/document-type/id')
          .expect(302)
          .expect('Location', '/auth/logout');
      });
    });
  });

  describe('POST /document-type/:id', () => {
    it('displays detail of document', () => {
      mockS3.send
        .mockResolvedValueOnce({
          Metadata: { old: 'meta', regulator_id: 'public.io' },
        })
        .mockResolvedValueOnce({ updated: 'key' });

      return fixture
        .request()
        .post('/uploaded-documents/document-type/id')
        .send({ documentType: 'GD', key: 'key' })
        .set('Cookie', regulatorSession)
        .expect(302)
        .expect('Location', '/uploaded-documents/updated/id')
        .expect(() => {
          expect(mockS3.send).toBeCalledTimes(2);
        });
    });

    describe('guards', () => {
      it('redirects unauthenticated users', async () => {
        return fixture
          .request()
          .post('/uploaded-documents/document-type/id')
          .send({ documentType: 'GD', key: 'key' })
          .expect(302)
          .expect('Location', '/auth/logout');
      });
    });
  });
});
