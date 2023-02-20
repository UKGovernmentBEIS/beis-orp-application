export type ApiClient = {
  Attributes: { Name: string; Value: string }[];
  Enabled: boolean;
  MFAOptions: undefined;
  UserCreateDate: string;
  UserLastModifiedDate: string;
  UserStatus: string;
  Username: string;
};

export type ListUsersInGroupCommandResponse = {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    extendedRequestId?: string;
    cfId?: string;
    attempts: number;
    totalRetryDelay: number;
  };
  NextToken?: string;

  Users: ApiClient[];
};
