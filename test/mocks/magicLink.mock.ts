import { DEFAULT_USER_WITH_REGULATOR } from './user.mock';

export const magicLinkInitiationResponse = {
  $metadata: {
    httpStatusCode: 200,
    requestId: 'reqid',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0,
  },
  ChallengeParameters: {
    USERNAME: DEFAULT_USER_WITH_REGULATOR.cognitoUsername,
    email: DEFAULT_USER_WITH_REGULATOR.email,
  },
  Session: 'session',
};
