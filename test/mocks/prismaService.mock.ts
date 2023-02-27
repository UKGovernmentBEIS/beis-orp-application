import { User } from '../../src/server/auth/types/User';
import { PrismaService } from '../../src/server/prisma/prisma.service';

export const DEFAULT_REGULATOR = {
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
export const mockPrismaService = {
  provide: PrismaService,
  useValue: {
    regulator: {
      findUnique: () => DEFAULT_REGULATOR,
    },
    user: {
      create: (): User => DEFAULT_USER,
      findUnique: () => DEFAULT_USER,
    },
  },
};
