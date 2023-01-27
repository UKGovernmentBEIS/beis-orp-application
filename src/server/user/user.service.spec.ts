import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { mockLogger } from '../../../test/mocks/logger.mock';
import {
  DEFAULT_PRISMA_USER,
  mockPrismaService,
} from '../../../test/mocks/prismaService.mock';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, mockPrismaService, mockLogger],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createUser', () => {
    it('should return the result of prisma.user.create', async () => {
      const result = await service.createUser('e@mail.com');
      expect(result).toEqual(DEFAULT_PRISMA_USER);
    });

    it('should attach a regulator if matching domain', async () => {
      const REGULATOR = {
        id: 'id',
        domain: 'mail.com',
        name: 'regulator',
      };
      jest
        .spyOn(prismaService.regulator, 'findUnique')
        .mockResolvedValue(REGULATOR);

      const USER_WITH_REGULATOR = {
        ...DEFAULT_PRISMA_USER,
        regulator: REGULATOR,
      };
      const createSpy = jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValue(USER_WITH_REGULATOR);

      const result = await service.createUser('e@mail.com');
      expect(createSpy).toBeCalledWith({
        data: {
          email: 'e@mail.com',
          regulator: { connect: { domain: 'mail.com' } },
        },
      });
      expect(result).toEqual(USER_WITH_REGULATOR);
    });
  });

  describe('getUserByEmail', () => {
    it('returns the user found by prisma service', async () => {
      const result = await service.getUserByEmail('e@mail.com');
      expect(result).toEqual(DEFAULT_PRISMA_USER);
    });
  });
});
