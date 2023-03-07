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
describe('Ingest submit', () => {
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
    mockS3.send.mockResolvedValueOnce({ Metadata: { file_name: 'file.pdf' } });

    it('gets a the meta and displays the filename', () => {
      return fixture
        .request()
        .get('/ingest/submit?key=unconfirmeddoc')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          const allValues = $('dd.govuk-summary-list__value');
          expect($(allValues.get(0)).text().trim()).toEqual('file.pdf');
          expect($(allValues.get(1)).text().trim()).toEqual('Other');
          expect($('button[type="submit"]').text().trim()).toEqual('Upload');
          expect(
            $('input[type="hidden"][value="unconfirmeddoc"][name="key"]'),
          ).toBeTruthy();
        });
    });

    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        return fixture
          .request()
          .get('/ingest/submit?key=unconfirmeddoc')
          .set('Cookie', nonRegulatorSession)
          .expect(302)
          .expect('Location', 'unauthorised/ingest');
      });

      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .get('/ingest/submit?key=unconfirmeddoc')
          .expect(302)
          .expect('Location', 'unauthorised/ingest');
      });
    });
  });

  describe('POST', () => {
    it('deletes the unconfirmed object if answer is no', async () => {
      mockS3.send
        .mockResolvedValueOnce({ from: 'unconfirmed/key', to: 'key' })
        .mockResolvedValueOnce({ deleted: 'unconfirmed/key' });

      return fixture
        .request()
        .post('/ingest/submit')
        .set('Cookie', regulatorSession)
        .send({ key: 'unconfirmed/key' })
        .expect(302)
        .expect('Location', '/ingest/success?key=key')
        .expect(() => {
          expect(mockS3.send).toBeCalledTimes(2);
        });
    });
    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        return fixture
          .request()
          .post('/ingest/submit')
          .set('Cookie', nonRegulatorSession)
          .send({ key: 'unconfirmed/key' })
          .expect(302)
          .expect('Location', 'unauthorised/ingest');
      });

      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .post('/ingest/submit')
          .send({ key: 'unconfirmed/key' })
          .expect(302)
          .expect('Location', 'unauthorised/ingest');
      });
    });
  });
});
