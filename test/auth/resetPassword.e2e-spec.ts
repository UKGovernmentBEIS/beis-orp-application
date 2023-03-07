import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getNonRegulatorSession } from '../helpers/userSessions';

describe('Password Reset (e2e)', () => {
  const fixture = new E2eFixture();
  let loggedInSession = null;

  beforeAll(async () => {
    await fixture.init();
    loggedInSession = await getNonRegulatorSession(fixture);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('auth/reset-password (GET)', () => {
    it('displays the reset password form', () => {
      return fixture
        .request()
        .get('/auth/reset-password')
        .set('Cookie', loggedInSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($("form[method='post'] > input[name='email']")).toBeTruthy();
          expect(
            $("form[method='post'] > input[name='verificationCode']"),
          ).toBeTruthy();
          expect(
            $("form[method='post'] > input[name='previousPassword']"),
          ).toBeTruthy();
          expect(
            $("form[method='post'] > input[name='newPassword']"),
          ).toBeTruthy();
          expect(
            $("form[method='post'] > input[name='confirmPassword']"),
          ).toBeTruthy();
        });
    });

    describe('guards', () => {
      it('redirects unauthenticated users from starting reset password flow', () => {
        return fixture
          .request()
          .get('/auth/reset-password')
          .expect(302)
          .expect('Location', '/auth/logout');
      });
    });
  });

  describe('auth/reset-password (POST)', () => {
    it('calls confirm password and displays success', () => {
      return fixture
        .request()
        .post('/auth/reset-password')
        .set('Cookie', loggedInSession)
        .send({
          previousPassword: '9.PAssworD1',
          email: 'e@mail.com',
          newPassword: '9.PAssworD',
          confirmPassword: '9.PAssworD',
        })
        .expect(302)
        .expect('Location', 'change-password-success');
    });
    it('redirects back if unacceptable password', () => {
      return fixture
        .request()
        .post('/auth/reset-password')
        .set('Cookie', loggedInSession)
        .send({
          previousPassword: '9.PAssworD1',
          email: 'e@mail.com',
          newPassword: 'rubbishpw',
          confirmPassword: 'rubbishpw',
        })
        .expect(302)
        .expect('Location', '/auth/reset-password');
    });

    it('redirects back if no prev password code', () => {
      return fixture
        .request()
        .post('/auth/reset-password')
        .set('Cookie', loggedInSession)
        .send({
          previousPassword: '',
          email: 'e@mail.com',
          newPassword: '9.PAssworD',
          confirmPassword: '9.PAssworD',
        })
        .expect(302)
        .expect('Location', '/auth/reset-password');
    });

    it('redirects back if no email address', () => {
      return fixture
        .request()
        .post('/auth/reset-password')
        .set('Cookie', loggedInSession)
        .send({
          verificationCode: 'code',
          email: '',
          newPassword: '9.PAssworD',
          confirmPassword: '9.PAssworD',
        })
        .expect(302)
        .expect('Location', '/auth/reset-password');
    });

    it('redirects back if two emails do not match', () => {
      return fixture
        .request()
        .post('/auth/reset-password')
        .set('Cookie', loggedInSession)
        .send({
          verificationCode: 'code',
          email: '',
          newPassword: '9.PAssworD',
          confirmPassword: '9.PAssworD4',
        })
        .expect(302)
        .expect('Location', '/auth/reset-password');
    });
  });
});
