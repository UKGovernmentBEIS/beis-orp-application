export default class AuthenticationResultDto {
  AuthenticationResult: Tokens;
}

class Tokens {
  AccessToken: string;
  ExpiresIn: number;
  IdToken: string;
  RefreshToken: string;
  TokenType: string;
}

export type CognitoAuthResponse = {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  AuthenticationResult: AuthenticationResultDto;
  ChallengeParameters: Record<string, any>;
};
