export type MagicLinkInitiationResponse = {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    extendedRequestId: string | undefined;
    cfId: string | undefined;
    attempts: number;
    totalRetryDelay: number;
  };
  ChallengeParameters: {
    USERNAME: string;
    email: string;
  };
  Session: string;
};
