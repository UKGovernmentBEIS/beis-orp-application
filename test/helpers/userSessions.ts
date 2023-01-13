import {
  CORRECT_EMAIL,
  CORRECT_NON_REG_EMAIL,
  CORRECT_PW,
  E2eFixture,
} from '../e2e.fixture';

export function getNonRegulatorSession(fixture: E2eFixture): Promise<string[]> {
  return new Promise((resolve) => {
    fixture
      .request()
      .post('/auth/login')
      .send({ email: CORRECT_NON_REG_EMAIL, password: CORRECT_PW })
      .expect(302)
      .end((err, res) => {
        const session = res.headers['set-cookie'];
        resolve(session);
      });
  });
}

export function getRegulatorSession(fixture: E2eFixture): Promise<string[]> {
  return new Promise((resolve) => {
    fixture
      .request()
      .post('/auth/login')
      .send({ email: CORRECT_EMAIL, password: CORRECT_PW })
      .expect(302)
      .end((err, res) => {
        const session = res.headers['set-cookie'];
        resolve(session);
      });
  });
}
