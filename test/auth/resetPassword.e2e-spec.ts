import { E2eFixture, mockCognito } from '../e2e.fixture';
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

  afterAll(() => {
    fixture.tearDown();
  });

  describe('auth/reset-password (GET)', () => {
    it('calls starts cognito reset password and redirects to confirmation form', () => {
      return fixture
        .request()
        .get('/auth/reset-password')
        .set('Cookie', loggedInSession)
        .expect(302)
        .expect('Location', 'reset-password-confirm')
        .expect(() => {
          expect(mockCognito.send).toBeCalledTimes(1);
        });
    });

    it('displays confirmation form on reset-password-confirm page', () => {
      return fixture
        .request()
        .get('/auth/reset-password-confirm')
        .set('Cookie', loggedInSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($("form[method='post'] > input[name='email']")).toBeTruthy();
          expect(
            $("form[method='post'] > input[name='verificationCode']"),
          ).toBeTruthy();
          expect(
            $("form[method='post'] > input[name='newPassword']"),
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

      it('displays confirmation page to unauthenticated users', () => {
        return fixture
          .request()
          .get('/auth/reset-password-confirm')
          .expect(200)
          .expect((res) => {
            const $ = cheerio.load(res.text);
            expect($("form[method='post'] > input[name='email']")).toBeTruthy();
            expect(
              $("form[method='post'] > input[name='verificationCode']"),
            ).toBeTruthy();
            expect(
              $("form[method='post'] > input[name='newPassword']"),
            ).toBeTruthy();
          });
      });
    });
  });

  describe('auth/reset-password-confirm (POST)', () => {
    it('calls confirm password and displays success', () => {
      return fixture
        .request()
        .post('/auth/reset-password-confirm')
        .set('Cookie', loggedInSession)
        .send({
          verificationCode: 'code',
          email: 'e@mail.com',
          newPassword: '9.PAssworD',
        })
        .expect(201)
        .expect((res) => {
          expect(mockCognito.send).toBeCalledTimes(1);
          const $ = cheerio.load(res.text);
          expect($('h1').text().trim()).toEqual('Password successfully reset');
        });
    });
    it('redirects back if unacceptable password', () => {
      return fixture
        .request()
        .post('/auth/reset-password-confirm')
        .send({
          verificationCode: 'code',
          email: 'e@mail.com',
          newPassword: 'rubbishpw',
        })
        .expect(302)
        .expect('Location', '/auth/reset-password-confirm');
    });

    it('redirects back if no verification code', () => {
      return fixture
        .request()
        .post('/auth/reset-password-confirm')
        .send({
          verificationCode: '',
          email: 'e@mail.com',
          newPassword: '9.PAssworD',
        })
        .expect(302)
        .expect('Location', '/auth/reset-password-confirm');
    });

    it('redirects back if no email address', () => {
      return fixture
        .request()
        .post('/auth/reset-password-confirm')
        .send({
          verificationCode: 'code',
          email: '',
          newPassword: '9.PAssworD',
        })
        .expect(302)
        .expect('Location', '/auth/reset-password-confirm');
    });
  });
});
