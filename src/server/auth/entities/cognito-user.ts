export default interface CognitoUser {
  Username: string;
  UserAttributes: { Name: 'sub' | 'custom:regulator'; Value: string }[];
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    extendedRequestId: string;
    cfId: string;
    attempts: number;
    totalRetryDelay: number;
  };
}
