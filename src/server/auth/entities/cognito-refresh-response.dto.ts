export type CognitoRefreshResponse = {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  AuthenticationResult: {
    AccessToken: string;
    ExpiresIn: number;
    IdToken: string;
    TokenType: string;
  };
  ChallengeParameters: Record<string, any>;
};
