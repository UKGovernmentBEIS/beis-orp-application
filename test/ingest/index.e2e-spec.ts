import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import {
  getNonRegulatorSession,
  getRegulatorSession,
} from '../helpers/userSessions';

describe('Ingest index', () => {
  const fixture = new E2eFixture();

  beforeAll(async () => {
    await fixture.init();
  });

  afterAll(() => {
    fixture.tearDown();
  });

  it('ingest/ (GET)', async () => {
    const session = await getRegulatorSession(fixture);
    return fixture
      .request()
      .get('/ingest')
      .set('Cookie', session)
      .expect(200)
      .expect((res) => {
        const $ = cheerio.load(res.text);
        expect($("a[href='/ingest/upload']").text().trim()).toEqual('Start');
      });
  });

  describe('Guards', () => {
    it('redirects non-regulator users', async () => {
      const session = await getNonRegulatorSession(fixture);
      return fixture
        .request()
        .get('/ingest')
        .set('Cookie', session)
        .expect(302)
        .expect('Location', 'unauthorised/ingest');
    });

    it('redirects unauthenticated users', () => {
      return fixture
        .request()
        .get('/ingest')
        .expect(302)
        .expect('Location', 'unauthorised/ingest');
    });
  });
});
