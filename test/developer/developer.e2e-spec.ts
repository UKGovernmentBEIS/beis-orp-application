import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getRegulatorSession } from '../helpers/userSessions';

describe('Developer Portal (e2e)', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;

  beforeAll(async () => {
    await fixture.init();
    regulatorSession = await getRegulatorSession(fixture);
  });

  describe('developer/ (GET)', () => {
    it('displays create credentials form', () => {
      return fixture
        .request()
        .get('/developer')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($("form[action='/developer/new-credentials']")).toBeTruthy();
        });
    });

    it('displays existing credentials with remove option', () => {
      return fixture
        .request()
        .get('/developer')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          const existingCreds = $('.existing-api-credentials');
          expect(existingCreds.length).toEqual(2);
          expect(
            $(existingCreds)
              .first()
              .find(
                '.existing-api-credentials__top ' +
                  '> form[action="/developer/remove-credentials"] ' +
                  '> input[name="username"][value="CLIENT"]',
              ),
          ).toBeTruthy();
        });
    });
  });
});
