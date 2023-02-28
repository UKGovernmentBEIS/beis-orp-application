import { CognitoAuthResponse } from '../../src/server/auth/types/CognitoAuthResponse';
import ApiTokensDto from '../../src/server/api/types/ApiTokensDto';

export const mockTokens: CognitoAuthResponse['AuthenticationResult'] = {
  AccessToken: 'access_token',
  ExpiresIn: 3600,
  IdToken: 'id_token',
  RefreshToken: 'refresh_token',
  TokenType: 'Bearer',
};

export const mockTokensReturn: ApiTokensDto = {
  access_token: 'access_token',
  expires_in: 3600,
  id_token: 'id_token',
  refresh_token: 'refresh_token',
  token_type: 'Bearer',
};
