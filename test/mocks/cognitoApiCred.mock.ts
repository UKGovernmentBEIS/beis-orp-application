import { ApiClient } from '../../src/server/auth/entities/api-client';

export const DEFAULT_API_CREDENTIAL: ApiClient = {
  Attributes: [{ Name: 'custom:regulator', Value: 'regulatorId' }],
  Enabled: true,
  MFAOptions: undefined,
  UserCreateDate: '2022-01-24T12:54:49Z',
  UserLastModifiedDate: '2022-01-24T12:54:49Z',
  UserStatus: 'Enabled',
  Username: 'userId',
};
