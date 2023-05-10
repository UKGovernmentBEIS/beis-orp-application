import { CognitoAuthResponse } from '../../src/server/auth/types/CognitoAuthResponse';

export const mockTokens: CognitoAuthResponse['AuthenticationResult'] = {
  AccessToken: 'access_token',
  ExpiresIn: 3600,
  IdToken: 'id_token',
  RefreshToken: 'refresh_token',
  TokenType: 'Bearer',
};
