import { Regulator } from '../../regulator/types/Regulator';

export type User = {
  cognitoUsername: string;
  email: string;
  regulator?: Regulator;

  accessToken: string;
};

export type ApiUser = Omit<User, 'email' | 'accessToken' | 'regulator'> & {
  regulator: string;
};

export const isApiUser = (user: User | ApiUser): user is ApiUser =>
  typeof user.regulator === 'string';
