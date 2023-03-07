import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { DEFAULT_USER } from '../../../test/mocks/user.mock';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('userDetails', () => {
    it('should return the user details', async () => {
      const result = await controller.userDetails(DEFAULT_USER);
      expect(result).toEqual(DEFAULT_USER);
    });
  });
});
