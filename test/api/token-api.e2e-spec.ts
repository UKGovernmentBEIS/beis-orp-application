import {
  CORRECT_API_CLIENT,
  CORRECT_API_SECRET,
  E2eFixture,
} from '../e2e.fixture';
import { mockTokens, mockTokensResponse } from '../mocks/tokens.mock';

describe('api/tokens (GET)', () => {
  const fixture = new E2eFixture();

  beforeAll(async () => {
    await fixture.init();
  });

  describe('token', () => {
    it('returns bad request if client_credentials not supplied', async () => {
      return fixture
        .request()
        .post('/api/tokens')
        .send({ client_id: 'a', client_secret: 'b' })
        .expect(400);
    });

    it('returns bad request if client_credentials no secret', async () => {
      return fixture
        .request()
        .post('/api/tokens')
        .send({
          grant_type: 'client_credentials',
          client_id: 'a',
          client_secret: '',
        })
        .expect(400);
    });

    it('returns bad request if client_credentials no id', async () => {
      return fixture
        .request()
        .post('/api/tokens')
        .send({
          grant_type: 'client_credentials',
          client_id: '',
          client_secret: 'b',
        })
        .expect(400);
    });

    it('logs in with client credentials if grant type selected', async () => {
      return fixture
        .request()
        .post('/api/tokens')
        .send({
          grant_type: 'client_credentials',
          client_id: CORRECT_API_CLIENT,
          client_secret: CORRECT_API_SECRET,
        })
        .expect(201)
        .expect(mockTokensResponse);
    });

    it('logs in with refresh token if grant type selected', async () => {
      return fixture
        .request()
        .post('/api/tokens')
        .send({
          grant_type: 'refresh_token',
          refresh_token: mockTokens.RefreshToken,
        })
        .expect(201)
        .expect(mockTokensResponse);
    });

    it('returns bad request if refresh_token no token', async () => {
      return fixture
        .request()
        .post('/api/tokens')
        .send({
          grant_type: 'refresh_token',
          refresh_token: '',
        })
        .expect(400);
    });
  });
});
