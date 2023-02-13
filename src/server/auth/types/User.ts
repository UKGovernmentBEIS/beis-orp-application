import { Regulator } from '@prisma/client';

export type User = {
  cognitoUsername: string;
  email: string;
  regulator?: Regulator;
};
