import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getRegulatorSession } from '../helpers/userSessions';
import { FULL_TOPIC_PATH } from '../mocks/topics';

describe('Ingest url: topics', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;

  beforeEach(async () => {
    await fixture.init({
      sessionOverride: { urlIngestion: { uri: 'www.gov.uk' } },
    });
    regulatorSession = await getRegulatorSession(fixture);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('gets a the meta and displays the selections if they exist', async () => {
      await fixture.init({
        sessionOverride: {
          urlIngestion: {
            uri: 'www.gov.uk',
            topics: JSON.stringify(FULL_TOPIC_PATH),
          },
        },
      });
      regulatorSession = await getRegulatorSession(fixture);
      return fixture
        .request()
        .get('/ingest/url/document-topics')
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
        });
    });

    it('displays the first dropdown if no selections', () => {
      return fixture
        .request()
        .get('/ingest/url/document-topics')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('select').length).toEqual(1);
        });
    });

    describe('guards', () => {
      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .get('/ingest/url/document-topics')
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });

  describe('POST', () => {
    it('updates an redirects to document-status', async () => {
      return fixture
        .request()
        .post('/ingest/url/document-topics')
        .set('Cookie', regulatorSession)
        .send({
          documentTopics: { topics: FULL_TOPIC_PATH },
        })
        .expect(302)
        .expect('Location', '/ingest/url/document-status');
    });

    describe('guards', () => {
      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .post('/ingest/url/document-topics')
          .send({ key: 'unconfirmed/key', documentType: { new: 'meta' } })
          .expect(302)
          .expect('Location', '/unauthorised/ingest');
      });
    });
  });
});
