import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import {
  getNonRegulatorSession,
  getRegulatorSession,
} from '../helpers/userSessions';

const mockUrl = 'http://document';
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
    GetObjectCommand: jest.fn((args) => ({ ...args, getObjectCommand: true })),
  };
});
jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: () => mockUrl,
  };
});
describe('Ingest confirm', () => {
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
    mockS3.send.mockResolvedValueOnce('http://doc.pdf');

    it('gets a presigned url for document and displays to user', () => {
      return fixture
        .request()
        .get('/ingest/confirm?key=unconfirmeddoc')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($(`object[data=${mockUrl}]`)).toBeTruthy();
          expect(
            $("input[name='confirm'][type='radio'][vallue='yes']"),
          ).toBeTruthy();
          expect(
            $("input[name='confirm'][type='radio'][vallue='no']"),
          ).toBeTruthy();
        });
    });

    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        return fixture
          .request()
          .get('/ingest/confirm?key=unconfirmeddoc')
          .set('Cookie', nonRegulatorSession)
          .expect(302)
          .expect('Location', 'unauthorised/ingest');
      });

      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .get('/ingest/confirm?key=unconfirmeddoc')
          .expect(302)
          .expect('Location', 'unauthorised/ingest');
      });
    });
  });

  describe('POST', () => {
    it('redirects to document-type page if answer is yes', async () => {
      return fixture
        .request()
        .post('/ingest/confirm')
        .set('Cookie', regulatorSession)
        .send({ confirm: 'yes', key: 'key' })
        .expect(302)
        .expect('Location', '/ingest/document-type?key=key');
    });

    it('deletes the unconfirmed object if answer is no', async () => {
      mockS3.send.mockResolvedValueOnce('response');

      return fixture
        .request()
        .post('/ingest/confirm')
        .set('Cookie', regulatorSession)
        .send({ confirm: 'no', key: 'key' })
        .expect(302)
        .expect('Location', '/ingest/upload')
        .expect(() => {
          expect(mockS3.send).toBeCalledWith({
            deleteObjectCommand: true,
            Bucket: 'bucket',
            Key: 'key',
          });
        });
    });

    it('displays validation error if no answer selected', async () => {
      mockS3.send.mockResolvedValueOnce('response');

      return fixture
        .request()
        .post('/ingest/confirm?key=key')
        .set('Cookie', regulatorSession)
        .send({ confirm: '', key: 'key' })
        .expect(302)
        .expect('Location', '/ingest/confirm?key=key')
        .expect(() => {
          expect(mockS3.send).toBeCalledTimes(0);
        });
    });

    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        return fixture
          .request()
          .post('/ingest/confirm')
          .send({ confirm: 'yes', key: 'key' })
          .set('Cookie', nonRegulatorSession)
          .expect(302)
          .expect('Location', 'unauthorised/ingest');
      });

      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .post('/ingest/confirm')
          .send({ confirm: 'yes', key: 'key' })
          .expect(302)
          .expect('Location', 'unauthorised/ingest');
      });
    });
  });
});
