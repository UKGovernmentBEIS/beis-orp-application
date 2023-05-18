import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
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

describe('uploaded-documents/status', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;
  let nonRegulatorSession = null;

  beforeAll(async () => {
    await fixture.init();
    regulatorSession = await getRegulatorSession(fixture);
    nonRegulatorSession = await getNonRegulatorSession(fixture);
  });

  describe('GET /status/:id', () => {
    it('displays detail of document', () => {
      return fixture
        .request()
        .get('/uploaded-documents/status/id')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('input[name="status"]').length).toEqual(2);
          expect($('button[type="submit"]').text().trim()).toEqual('Update');
          expect(
            $('input[type="hidden"][value="doc.pdf"][name="key"]').length,
          ).toBeTruthy();
        });
    });

    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        return fixture
          .request()
          .get('/uploaded-documents/status/id')
          .set('Cookie', nonRegulatorSession)
          .expect(302)
          .expect('Location', '/auth/logout');
      });

      it('redirects unauthenticated users', async () => {
        return fixture
          .request()
          .get('/uploaded-documents/status/id')
          .expect(302)
          .expect('Location', '/auth/logout');
      });
    });
  });

  describe('POST /document-type/:id', () => {
    it('displays detail of document', () => {
      mockS3.send
        .mockResolvedValueOnce({
          Metadata: { old: 'meta', regulator_id: 'ofcom' },
        })
        .mockResolvedValueOnce({ updated: 'key' });

      return fixture
        .request()
        .post('/uploaded-documents/status/id')
        .set('Cookie', regulatorSession)
        .send({ key: 'unconfirmed/key', status: 'published' })
        .expect(302)
        .expect('Location', '/uploaded-documents/updated/id')
        .expect(() => {
          expect(mockS3.send).toBeCalledTimes(2);
        });
    });

    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        return fixture
          .request()
          .post('/uploaded-documents/status/id')
          .send({ key: 'unconfirmed/key', status: 'published' })
          .set('Cookie', nonRegulatorSession)
          .expect(302)
          .expect('Location', '/auth/logout');
      });

      it('redirects unauthenticated users', async () => {
        return fixture
          .request()
          .post('/uploaded-documents/status/id')
          .send({ key: 'unconfirmed/key', status: 'published' })
          .expect(302)
          .expect('Location', '/auth/logout');
      });
    });
  });
});
