import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import {
  getNonRegulatorSession,
  getRegulatorSession,
} from '../helpers/userSessions';
import { FULL_TOPIC_OUTPUT } from '../mocks/topics';

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
    it('displays detail of document', () => {
      return fixture
        .request()
        .get('/uploaded-documents/detail/id')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          const allValues = $('dd.govuk-summary-list__value');
          expect($(allValues.get(0)).text().trim()).toEqual('Title1');
          expect($(allValues.get(1)).text().trim()).toEqual('Guidance');
          expect($(allValues.get(2)).text().trim()).toEqual(
            FULL_TOPIC_OUTPUT[0],
          );
          expect($(allValues.get(3)).text().trim()).toEqual(
            FULL_TOPIC_OUTPUT[1],
          );
          expect($(allValues.get(4)).text().trim()).toEqual(
            FULL_TOPIC_OUTPUT[2],
          );
          expect($(allValues.get(5)).text().trim()).toEqual('Active');
        });
    });

    describe('guards', () => {
      it('redirects non-regulator users', async () => {
        return fixture
          .request()
          .get('/uploaded-documents/detail/id')
          .set('Cookie', nonRegulatorSession)
          .expect(302)
          .expect('Location', '/auth/logout');
      });

      it('redirects unauthenticated users', async () => {
        return fixture
          .request()
          .get('/uploaded-documents/detail/id')
          .expect(302)
          .expect('Location', '/auth/logout');
      });
    });
  });
});
