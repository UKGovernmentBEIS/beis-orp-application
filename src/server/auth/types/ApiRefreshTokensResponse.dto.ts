export default class ApiRefreshTokensResponseDto {
  AccessToken: string;
  ExpiresIn: number;
  IdToken: string;
  TokenType: string;
}

export type CognitoRefreshResponse = {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  AuthenticationResult: ApiRefreshTokensResponseDto;
  ChallengeParameters: Record<string, any>;
};
