import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import {
  getNonRegulatorSession,
  getRegulatorSession,
} from '../helpers/userSessions';

describe('uploaded-documents', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;
  let nonRegulatorSession = null;

  beforeAll(async () => {
    await fixture.init();
    regulatorSession = await getRegulatorSession(fixture);
    nonRegulatorSession = await getNonRegulatorSession(fixture);
  });

  describe('findAll', () => {
    it('displays list of documents that has been uploaded by regulator', () => {
      return fixture
        .request()
        .get('/uploaded-documents')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('ul#uploaded-documents-results>li').length).toEqual(10);
          expect(
            $('ul#uploaded-documents-results>li:first > h2').text().trim(),
          ).toEqual('Title1');
        });
    });

    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        return fixture
          .request()
          .get('/uploaded-documents')
          .set('Cookie', nonRegulatorSession)
          .expect(302)
          .expect('Location', '/auth/logout');
      });

      it('redirects unauthenticated users', async () => {
        return fixture
          .request()
          .get('/uploaded-documents')
          .expect(302)
          .expect('Location', '/auth/logout');
      });
    });
  });
});
