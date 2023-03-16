import { E2eFixture, mockCognito } from '../e2e.fixture';
import * as cheerio from 'cheerio';

describe('Register (e2e)', () => {
  const fixture = new E2eFixture();

  beforeAll(async () => {
    await fixture.init();
  });

  describe('auth/register (GET)', () => {
    it('displays registration form', () => {
      return fixture
        .request()
        .get('/auth/register')
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect(
            $("form[method='post'] input[name='email']").length,
          ).toBeTruthy();
          expect(
            $("form[method='post'] input[name='password']").length,
          ).toBeTruthy();
        });
    });
  });

  describe('auth/register (POST)', () => {
    it('signs up a user in cognito', () => {
      return fixture
        .request()
        .post('/auth/register')
        .send({
          email: 'user@test.com',
          password: '9.PAssworD',
          confirmPassword: '9.PAssworD',
        })
        .expect(302)
        .expect('Location', '/auth/unconfirmed')
        .expect(() => {
          expect(mockCognito.send).toBeCalledTimes(1);
          expect(mockCognito.send).toBeCalledWith({
            signUpCommand: true,
          });
        });
    });

    describe('validation', () => {
      it('redirects back if invalid email', () => {
        return fixture
          .request()
          .post('/auth/register')
          .send({ email: `testtest.com`, password: '9.PAssworD' })
          .expect(302)
          .expect('Location', '/auth/register');
      });

      test.each`
        pw              | title
        ${'9.PaD'}      | ${'< 8 characters'}
        ${'.PAssworD'}  | ${'no number'}
        ${'9PAssworD'}  | ${'no special character'}
        ${'9.PASSWORD'} | ${'no lowercase letter'}
        ${'9.password'} | ${'no capital letter'}
      `('fails if $title', ({ pw }) => {
        return fixture
          .request()
          .post('/auth/register')
          .send({ email: 'test@test.com', password: pw })
          .expect(302)
          .expect('Location', '/auth/register');
      });
    });
  });
});
