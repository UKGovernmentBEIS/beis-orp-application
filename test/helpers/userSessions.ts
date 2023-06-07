import { CORRECT_CODE, E2eFixture } from '../e2e.fixture';

export function getRegulatorSession(fixture: E2eFixture): Promise<string[]> {
  return new Promise((resolve) => {
    fixture
      .request()
      .get('/auth/access-code')
      .query({ code: CORRECT_CODE })
      .expect(302)
      .end((err, res) => {
        const session = res.headers['set-cookie'];
        resolve(session);
      });
  });
}
