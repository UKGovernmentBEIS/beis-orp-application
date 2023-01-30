import { E2eFixture, mockCogUser } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getNonRegulatorSession } from '../helpers/userSessions';

describe('Password Reset (e2e)', () => {
  const fixture = new E2eFixture();
  let loggedInSession = null;

  beforeAll(async () => {
    await fixture.init();
    loggedInSession = await getNonRegulatorSession(fixture);
  });

  afterAll(() => {
    fixture.tearDown();
  });

  describe('auth/reset-password (GET)', () => {
    it('calls forgotPassword and displays reset form', () => {
      return fixture
        .request()
        .get('/auth/reset-password')
        .set('Cookie', loggedInSession)
        .expect(200)
        .expect((res) => {
          expect(mockCogUser.forgotPassword).toBeCalledTimes(1);
          const $ = cheerio.load(res.text);
          expect(
            $("form[method='post'] > input[name='verificationCode']"),
          ).toBeTruthy();
          expect(
            $("form[method='post'] > input[name='newPassword']"),
          ).toBeTruthy();
        });
    });

    describe('guards', () => {
      it('redirects unauthenticated users', () => {
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
        .send({ verificationCode: 'code', newPassword: '9.PAssworD' })
        .expect(201)
        .expect((res) => {
          expect(mockCogUser.confirmPassword).toBeCalledTimes(1);
          const $ = cheerio.load(res.text);
          expect($('h1').text().trim()).toEqual('Password successfully reset');
        });
    });
    it('redirects back if unacceptable password', () => {
      return fixture
        .request()
        .post('/auth/reset-password')
        .set('Cookie', loggedInSession)
        .send({ verificationCode: 'code', newPassword: 'rubbishpw' })
        .expect(302)
        .expect('Location', '/auth/reset-password');
    });

    it('redirects back if no verification code', () => {
      return fixture
        .request()
        .post('/auth/reset-password')
        .set('Cookie', loggedInSession)
        .send({ verificationCode: '', newPassword: 'rubbishpw' })
        .expect(302)
        .expect('Location', '/auth/reset-password');
    });

    describe('guards', () => {
      it('redirects unauthenticated users', () => {
        return fixture
          .request()
          .post('/auth/reset-password')
          .send({ verificationCode: 'code', newPassword: '9.PAssworD' })
          .expect(302)
          .expect('Location', '/auth/logout');
      });
    });
  });
});
