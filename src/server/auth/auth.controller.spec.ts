import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import * as mocks from 'node-mocks-http';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { mockAuthService } from '../../../test/mocks/authService.mock';
import { ApiKeyService } from './apiKey.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

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
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
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

  describe('resend-confirmation', () => {
    it('should resend confirmation link if there is an address in session', async () => {
      const req = mocks.createRequest({
        session: { unconfirmedEmail: ['email@email.com'] },
      });
      const res = mocks.createResponse();

      const resentSpy = jest.spyOn(authService, 'resendConfirmationCode');
      await controller.resendConfirmation(req, res);
      expect(resentSpy).toBeCalledTimes(1);
    });

    it('should not resend confirmation link if there is no address in session', async () => {
      const req = mocks.createRequest({
        session: {},
      });
      const res = mocks.createResponse();

      const resentSpy = jest.spyOn(authService, 'resendConfirmationCode');
      await controller.resendConfirmation(req, res);
      expect(resentSpy).toBeCalledTimes(0);
    });
  });
});
