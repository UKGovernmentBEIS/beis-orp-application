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
describe('Ingest document type', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;
  let nonRegulatorSession = null;

  beforeAll(async () => {
    await fixture.init();
    regulatorSession = await getRegulatorSession(fixture);
    nonRegulatorSession = await getNonRegulatorSession(fixture);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    mockS3.send.mockResolvedValueOnce({ Metadata: { old: 'meta' } });

    it('gets a the meta and displays the filename', () => {
      return fixture
        .request()
        .get('/ingest/document-type?key=unconfirmeddoc')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('input[name="documentType"]').length).toEqual(4);
          expect($('button[type="submit"]').text().trim()).toEqual('Continue');
          expect(
            $('input[type="hidden"][value="unconfirmeddoc"][name="key"]')
              .length,
          ).toBeTruthy();
        });
    });

    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        return fixture
          .request()
          .get('/ingest/document-type?key=unconfirmeddoc')
          .set('Cookie', nonRegulatorSession)
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });

      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .get('/ingest/document-type?key=unconfirmeddoc')
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });

  describe('POST', () => {
    it('updates the meta data with selected option', async () => {
      mockS3.send
        .mockResolvedValueOnce({ Metadata: { old: 'meta' } })
        .mockResolvedValueOnce({ updated: 'unconfirmed/key' });

      return fixture
        .request()
        .post('/ingest/document-type')
        .set('Cookie', regulatorSession)
        .send({ key: 'unconfirmed/key', documentType: { new: 'meta' } })
        .expect(302)
        .expect('Location', '/ingest/document-status?key=unconfirmed/key')
        .expect(() => {
          expect(mockS3.send).toBeCalledTimes(2);
        });
    });
    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        return fixture
          .request()
          .post('/ingest/document-type')
          .set('Cookie', nonRegulatorSession)
          .send({ key: 'unconfirmed/key', documentType: { new: 'meta' } })
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });

      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .post('/ingest/document-type')
          .send({ key: 'unconfirmed/key', documentType: { new: 'meta' } })
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });
});
