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

const TOPICS = [
  '/entering-staying-uk',
  '/entering-staying-uk/immigration-offences',
  '/entering-staying-uk/immigration-offences/immigration-penalties',
];
describe('Ingest document topics', () => {
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
    it('gets a the meta and displays the selections if they exist', () => {
      mockS3.send.mockResolvedValueOnce({
        Metadata: {
          topics: JSON.stringify(TOPICS),
        },
      });

      return fixture
        .request()
        .get('/ingest/document-topics?key=unconfirmeddoc')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('select').length).toEqual(3);
          expect(
            $(
              'select[name="topic1"] option[value="/entering-staying-uk"][selected]',
            )
              .text()
              .trim(),
          ).toEqual('Entering and staying in the UK');

          expect(
            $(
              'select[name="topic2"] option[value="/entering-staying-uk/immigration-offences"][selected]',
            )
              .text()
              .trim(),
          ).toEqual('Immigration offences');

          expect(
            $(
              'select[name="topic3"] option[value="/entering-staying-uk/immigration-offences/immigration-penalties"][selected]',
            )
              .text()
              .trim(),
          ).toEqual('Immigration penalties');
          expect(
            $('input[type="hidden"][value="unconfirmeddoc"][name="key"]')
              .length,
          ).toBeTruthy();
        });
    });

    it('gets a the meta and displays the first dropdown if no selections', () => {
      mockS3.send.mockResolvedValueOnce({
        Metadata: {},
      });

      return fixture
        .request()
        .get('/ingest/document-topics?key=unconfirmeddoc')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('select').length).toEqual(1);
        });
    });

    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        return fixture
          .request()
          .get('/ingest/document-topics?key=unconfirmeddoc')
          .set('Cookie', nonRegulatorSession)
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });

      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .get('/ingest/document-topics?key=unconfirmeddoc')
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });

  describe('POST', () => {
    it('updates the meta data with selected topics', async () => {
      mockS3.send
        .mockResolvedValueOnce({ Metadata: { old: 'meta' } })
        .mockResolvedValueOnce({ updated: 'unconfirmed/key' });

      return fixture
        .request()
        .post('/ingest/document-topics')
        .set('Cookie', regulatorSession)
        .send({ key: 'unconfirmed/key', documentTopics: { topics: TOPICS } })
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
          .post('/ingest/document-topics')
          .set('Cookie', nonRegulatorSession)
          .send({ key: 'unconfirmed/key', documentType: { new: 'meta' } })
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });

      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .post('/ingest/document-topics')
          .send({ key: 'unconfirmed/key', documentType: { new: 'meta' } })
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });
});
