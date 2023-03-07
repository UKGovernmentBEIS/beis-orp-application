import { User } from '../../src/server/auth/types/User';
import { Regulator } from '../../src/server/regulator/types/Regulator';

export const DEFAULT_REGULATOR: Regulator = {
  name: 'Regulator',
  id: 'rid',
  domain: 'regulator.com',
};
export const DEFAULT_USER: User = {
  cognitoUsername: 'cogun',
  email: 'e@mail.com',
  regulator: null,
  accessToken: 'token',
};

export const DEFAULT_USER_WITH_REGULATOR: User = {
  cognitoUsername: 'cogun',
  email: 'e@mail.com',
  regulator: DEFAULT_REGULATOR,
  accessToken: 'token',
};
