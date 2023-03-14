import { E2eFixture, mockCognito } from '../e2e.fixture';
import * as cheerio from 'cheerio';

describe('Forgot Reset (e2e)', () => {
  const fixture = new E2eFixture();

  beforeAll(async () => {
    await fixture.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('auth/new-password (GET)', () => {
    it('displays the forgotten password form', () => {
      return fixture
        .request()
        .get('/auth/new-password')
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($("form[method='post'] > input[name='email']")).toBeTruthy();
        });
    });
  });

  describe('auth/new-password (POST)', () => {
    it('calls forgot password and redirects to set-new-password page', () => {
      return fixture
        .request()
        .post('/auth/new-password')
        .send({
          email: 'e@mail.com',
        })
        .expect(302)
        .expect('Location', 'set-new-password')
        .expect(() => {
          expect(mockCognito.send).toBeCalledTimes(1);
          expect(mockCognito.send).toBeCalledWith({
            forgotPasswordCommand: true,
          });
        });
    });

    it('redirects back if no email address', () => {
      return fixture
        .request()
        .post('/auth/new-password')
        .send({
          email: '',
        })
        .expect(302)
        .expect('Location', '/auth/new-password');
    });
  });

  describe('auth/set-new-password (SET)', () => {
    function getEmailSetSession(): Promise<string[]> {
      return new Promise((resolve) => {
        return fixture
          .request()
          .post('/auth/new-password')
          .send({
            email: 'e@mail.com',
          })
          .end((err, res) => {
            const session = res.headers['set-cookie'];
            resolve(session);
          });
      });
    }

    it('displays the set new password form with email value from session', async () => {
      const emailSetSession = await getEmailSetSession();
      return fixture
        .request()
        .get('/auth/new-password')
        .set('Cookie', emailSetSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect(
            $("form[method='post'] > input[name='email'][value='e@mail.com']"),
          ).toBeTruthy();
          expect(
            $("form[method='post'] > input[name='verificationCode']"),
          ).toBeTruthy();
          expect(
            $("form[method='post'] > input[name='newPassword']"),
          ).toBeTruthy();
          expect(
            $("form[method='post'] > input[name='confirmPassword']"),
          ).toBeTruthy();
        });
    });
  });

  describe('auth/set-new-password (POST)', () => {
    it('calls forgot password confirmation and redirects to success page', () => {
      return fixture
        .request()
        .post('/auth/set-new-password')
        .send({
          email: 'e@mail.com',
          verificationCode: 'code',
          newPassword: '9.PAssworD1',
          confirmPassword: '9.PAssworD1',
        })
        .expect(302)
        .expect('Location', 'forgot-password-success')
        .expect(() => {
          expect(mockCognito.send).toBeCalledTimes(1);
          expect(mockCognito.send).toBeCalledWith({
            confirmForgotPasswordCommand: true,
          });
        });
    });
    it('redirects back if no email address', () => {
      return fixture
        .request()
        .post('/auth/set-new-password')
        .send({
          email: '',
          verificationCode: 'code',
          newPassword: '9.PAssworD1',
          confirmPassword: '9.PAssworD1',
        })
        .expect(302)
        .expect('Location', '/auth/set-new-password');
    });

    it('redirects back if no verification code', () => {
      return fixture
        .request()
        .post('/auth/set-new-password')
        .send({
          email: 'e@mail.com',
          verificationCode: '',
          newPassword: '9.PAssworD1',
          confirmPassword: '9.PAssworD1',
        })
        .expect(302)
        .expect('Location', '/auth/set-new-password');
    });

    it('redirects back if no pw', () => {
      return fixture
        .request()
        .post('/auth/set-new-password')
        .send({
          email: 'e@mail.com',
          verificationCode: 'code',
          newPassword: '',
          confirmPassword: '9.PAssworD1',
        })
        .expect(302)
        .expect('Location', '/auth/set-new-password');
    });

    it('redirects back if no confirm pw', () => {
      return fixture
        .request()
        .post('/auth/set-new-password')
        .send({
          email: 'e@mail.com',
          verificationCode: 'code',
          newPassword: '9.PAssworD1',
          confirmPassword: '',
        })
        .expect(302)
        .expect('Location', '/auth/set-new-password');
    });

    it('redirects back if unmatching pws', () => {
      return fixture
        .request()
        .post('/auth/set-new-password')
        .send({
          email: 'e@mail.com',
          verificationCode: 'code',
          newPassword: '9.PAssworD1',
          confirmPassword: '9.PAssworD',
        })
        .expect(302)
        .expect('Location', '/auth/set-new-password');
    });
  });
});
