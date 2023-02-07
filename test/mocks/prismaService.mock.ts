import { User } from '@prisma/client';
import { PrismaService } from '../../src/server/prisma/prisma.service';

export const DEFAULT_REGULATOR = {
  name: 'Regulator',
  id: 'rid',
  domain: 'regulator.com',
};
export const DEFAULT_PRISMA_USER = {
  id: 'id',
  email: 'e@mail.com',
  regulatorId: null,
};

export const DEFAULT_PRISMA_USER_WITH_REGULATOR = {
  email: 'e@mail.com',
  id: 'id',
  regulatorId: 'rid',
  regulator: DEFAULT_REGULATOR,
};
export const mockPrismaService = {
  provide: PrismaService,
  useValue: {
    regulator: {
      findUnique: () => DEFAULT_REGULATOR,
    },
    user: {
      create: (): User => DEFAULT_PRISMA_USER,
      findUnique: () => DEFAULT_PRISMA_USER,
    },
  },
};
