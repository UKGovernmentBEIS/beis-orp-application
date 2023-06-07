import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';
import { getRegulatorSession } from '../helpers/userSessions';

describe('uploaded-documents/delete', () => {
  const fixture = new E2eFixture();
  let regulatorSession = null;

  beforeAll(async () => {
    await fixture.init();
    regulatorSession = await getRegulatorSession(fixture);
  });

  describe('GET /delete/:id', () => {
    it('displays detail of document with confirmation button', () => {
      return fixture
        .request()
        .get('/uploaded-documents/delete/id')
        .set('Cookie', regulatorSession)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('input[name="id"][type="hidden"]').length).toEqual(1);
          expect($('button[type="submit"]').text().trim()).toEqual(
            "Yes I'm sure - delete this document",
          );
        });
    });

    describe('guards', () => {
      it('redirects unauthenticated users', async () => {
        return fixture
          .request()
          .get('/uploaded-documents/delete/id')
          .expect(302)
          .expect('Location', '/auth/logout');
      });
    });
  });

  describe('POST /delete', () => {
    it('calls delete document lambda and redirects to confirmation', () => {
      return fixture
        .request()
        .post('/uploaded-documents/delete')
        .set('Cookie', regulatorSession)
        .send({ id: 'uuid' })
        .expect(302)
        .expect('Location', '/uploaded-documents/deleted');
    });

    describe('guards', () => {
      it('redirects unauthenticated users', async () => {
        return fixture
          .request()
          .post('/uploaded-documents/delete')
          .send({ id: 'uuid' })
          .expect(302)
          .expect('Location', '/auth/logout');
      });
    });
  });
});
