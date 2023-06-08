import { CognitoAuthResponse } from '../../src/server/auth/entities/cognito-auth-response';

export const mockTokens: CognitoAuthResponse['AuthenticationResult'] = {
  AccessToken: 'access_token',
  ExpiresIn: 3600,
  IdToken: 'id_token',
  RefreshToken: 'refresh_token',
  TokenType: 'Bearer',
};
