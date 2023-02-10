import { E2eFixture, mockCognito } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getNonRegulatorSession } from '../helpers/userSessions';

describe('Register (e2e)', () => {
  const fixture = new E2eFixture();
  let loggedInSession = null;

  beforeAll(async () => {
    await fixture.init();
    loggedInSession = await getNonRegulatorSession(fixture);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    fixture.tearDown();
  });

  describe('auth/delete-user (GET)', () => {
    it('displays confirmation link', () => {
      return fixture
        .request()
        .get('/auth/delete-user')
        .set('Cookie', loggedInSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect(
            $("a[href='/auth/delete-user-confirmation']").text().trim(),
          ).toEqual('Delete account');
          expect(
            $("a.govuk-button--secondary[href='/search']").text().trim(),
          ).toEqual('Cancel');
        });
    });

    describe('guards', () => {
      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .get('/auth/delete-user')
          .expect(302)
          .expect('Location', '/auth/logout');
      });
    });
  });

  describe('/auth/delete-user-confirmation (POST)', () => {
    it('deletes a user from cognito and database', () => {
      return fixture
        .request()
        .get('/auth/delete-user-confirmation')
        .set('Cookie', loggedInSession)
        .expect(200)
        .expect(() => {
          expect(mockCognito.send).toBeCalledTimes(1);
          expect(mockCognito.send).toBeCalledWith({ deleteUserCommand: true });
        });
    });
  });
});
