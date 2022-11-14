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
        expect(res.text).toContain('Building the Open Regulation Platform');
      });
  });
});
