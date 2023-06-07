import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getRegulatorSession } from '../helpers/userSessions';
import { FULL_TOPIC_PATH } from '../mocks/topics';

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

describe('uploaded-documents/topics', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;

  beforeAll(async () => {
    await fixture.init();
    regulatorSession = await getRegulatorSession(fixture);
  });

  describe('GET /topics/:id', () => {
    it('displays selected topics of document', () => {
      return fixture
        .request()
        .get('/uploaded-documents/topics/id')
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
          expect($('input[type="hidden"][name="key"]').length).toBeTruthy();
        });
    });

    describe('guards', () => {
      it('redirects unauthenticated users', async () => {
        return fixture
          .request()
          .get('/uploaded-documents/topics/id')
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
        .post('/uploaded-documents/topics/id')
        .send({
          topic1: FULL_TOPIC_PATH[0],
          topic2: FULL_TOPIC_PATH[1],
          key: 'key',
        })
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
          .send({
            topic1: FULL_TOPIC_PATH[0],
            topic2: FULL_TOPIC_PATH[1],
            key: 'key',
          })
          .expect(302)
          .expect('Location', '/auth/logout');
      });
    });
  });
});
