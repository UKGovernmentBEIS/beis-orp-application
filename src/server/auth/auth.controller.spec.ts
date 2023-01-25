import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import * as mocks from 'node-mocks-http';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { mockAuthService } from '../../../test/mocks/authService.mock';
import { ApiKeyService } from './apiKey.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockLogger } from '../../../test/mocks/logger.mock';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        mockAuthService,
        mockConfigService,
        ApiKeyService,
        PrismaService,
        mockLogger,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should call register user on auth service', () => {
      expect(
        controller.register({ email: 'email@e.com', password: 'pw' }),
      ).toEqual('MOCK_REGISTER_RESPONSE');
    });
  });

  describe('loginPost', () => {
    it('should return the user', () => {
      expect(
        controller.loginPost(mocks.createRequest({ user: 'USER' })),
      ).toEqual('USER');
    });
  });

  describe('logout', () => {
    it('should destroy the session', () => {
      const destroyMock = jest.fn();
      controller.logout(
        mocks.createRequest({ session: { destroy: destroyMock } }),
      );

      expect(destroyMock).toBeCalledTimes(1);
    });
  });
});
