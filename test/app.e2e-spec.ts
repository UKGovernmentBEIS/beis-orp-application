import { E2eFixture } from './e2e.fixture';

describe('BlogController (e2e)', () => {
  const fixture = new E2eFixture();

  beforeEach(async () => {
    await fixture.init();
  });

  it('/ (GET)', () => {
    return fixture
      .request()
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain(
          '<a href="/blog/1" class="govuk-link">Making regulation more accessible: Value driven by the ORP</a>',
        );
      });
  });
});
