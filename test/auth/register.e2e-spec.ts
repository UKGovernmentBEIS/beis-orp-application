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
        });
    });
  });

  describe('auth/register (POST)', () => {
    it('signs up a user in cognito', () => {
      return fixture
        .request()
        .post('/auth/register')
        .send({
          email: 'user@ukas.com',
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

    it('rejects if non-regulator domain', () => {
      return fixture
        .request()
        .post('/auth/register')
        .send({
          email: 'user@test.com',
        })
        .expect(302)
        .expect('Location', '/auth/invalid-domain');
    });
  });
});
