import { CORRECT_CODE, E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';

describe('AuthController (e2e)', () => {
  const fixture = new E2eFixture();

  beforeAll(async () => {
    await fixture.init();
  });

  describe('auth/login (GET)', () => {
    it('displays login form', () => {
      return fixture
        .request()
        .get('/auth/login')
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect(
            $("form[method='post'] input[name='email']").length,
          ).toBeTruthy();
        });
    });
  });

  describe('auth/login (POST)', () => {
    it('redirects back if no email', () => {
      return fixture
        .request()
        .post('/auth/login')
        .send({ email: '' })
        .expect(302)
        .expect('Location', '/auth/login');
    });

    it('redirects to email-sent page if successful', () => {
      return fixture
        .request()
        .post('/auth/login')
        .send({ email: 'matt.whitfield@public.io' })
        .expect(302)
        .expect('Location', '/auth/email-sent');
    });
  });

  describe('auth/access-code (GET)', () => {
    it('logs user in and redirects to search', () => {
      return fixture
        .request()
        .get('/auth/access-code')
        .query({ code: CORRECT_CODE })
        .expect(302)
        .expect('Location', '/search');
    });
  });
});
