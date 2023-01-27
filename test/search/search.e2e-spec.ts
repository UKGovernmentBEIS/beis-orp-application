import { E2eFixture } from '../e2e.fixture';
import * as cheerio from 'cheerio';

describe('api/search (GET)', () => {
  const fixture = new E2eFixture();

  beforeAll(async () => {
    await fixture.init();
  });

  afterAll(() => {
    fixture.tearDown();
  });

  describe('search', () => {
    it('displays instruction if no query passed in', () => {
      return fixture
        .request()
        .get('/search')
        .query({})
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($("form[method='get']")).toBeTruthy();
          expect($("form[method='get'] > input[name='title']")).toBeTruthy();
          expect($("form[method='get'] > input[name='keyword']")).toBeTruthy();
          expect($('.search-no-content').text().trim()).toEqual(
            'Enter your keywords into one of the search bars and press search to see results.',
          );
        });
    });

    it('displays search results with link to document page for each orp doc', () => {
      return fixture
        .request()
        .get('/search')
        .query({ keyword: 'keyword', title: 'title' })
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($("a.govuk-tabs__tab[href='#orp']").text().trim()).toEqual(
            'Open Regulation Platform (13)',
          );
          expect($("a.govuk-tabs__tab[href='#tna']").text().trim()).toEqual(
            'National Archives (20)',
          );
          expect($('.orp-search-result').length).toEqual(10);
          expect($('.tna-search-result').length).toEqual(10);
          expect($("a[href='/document/0']").text().trim()).toEqual('Title1');
        });
    });
  });
});
