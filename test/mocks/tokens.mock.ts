import AuthenticationResultDto from '../../src/server/auth/types/AuthenticationResult.dto';

export const mockTokens: AuthenticationResultDto = {
  AccessToken: 'access_token',
  ExpiresIn: 3600,
  IdToken: 'id_token',
  RefreshToken: 'refresh_token',
  TokenType: 'Bearer',
};
