import { E2eFixture } from '../e2e.fixture';
import { expectedOutputForTnaStandardResponse } from '../mocks/tnaSearchMock';

describe('api/search (GET)', () => {
  const fixture = new E2eFixture();

  beforeEach(async () => {
    await fixture.init();
  });

  describe('validation', () => {
    it('returns bad request if both title and keyword is empty', async () => {
      return fixture.request().get('/api/search').send({}).expect(400);
    });

    it('is successful if title is provided', async () => {
      return fixture
        .request()
        .get('/api/search')
        .query({ title: 'title' })
        .expect(200);
    });

    it('is successful if keyword is provided', async () => {
      return fixture
        .request()
        .get('/api/search')
        .query({ keyword: 'keyword' })
        .expect(200);
    });

    it('is successful if keyword and title are provided', async () => {
      return fixture
        .request()
        .get('/api/search')
        .query({ keyword: 'keyword', title: 'title' })
        .expect(200);
    });
  });

  describe('tna search', () => {
    it('calls the national archives and parses the xml returning first 10 items', () => {
      return fixture
        .request()
        .get('/api/search')
        .query({ keyword: 'keyword', title: 'title' })
        .expect(200)
        .expect({ nationalArchive: expectedOutputForTnaStandardResponse });
    });
  });
});
