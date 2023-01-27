import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as mocks from 'node-mocks-http';
import { PrismaService } from '../prisma/prisma.service';
import { mockLogger } from '../../../test/mocks/logger.mock';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService, mockLogger],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('userDetails', () => {
    it('should return the details from userService', async () => {
      const request = mocks.createRequest({ user: { email: 'e@mail.com' } });
      const user = {
        id: '1',
        email: 'email@email.com',
        regulatorId: null,
        regulator: null,
      };
      const getUserSpy = jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(user);

      const result = await controller.userDetails(request);
      expect(getUserSpy).toBeCalledWith('e@mail.com');
      expect(result).toEqual(user);
    });
  });
});
