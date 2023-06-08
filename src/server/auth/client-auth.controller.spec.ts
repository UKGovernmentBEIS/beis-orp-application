import { Test, TestingModule } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { DEFAULT_USER } from '../../../test/mocks/user.mock';
import { mockClientAuthService } from '../../../test/mocks/clientAuthService.mock';
import { ClientAuthService } from './client-auth.service';
import { ClientAuthController } from './client-auth.controller';
import { magicLinkInitiationResponse } from '../../../test/mocks/magicLink.mock';
import { RegulatorService } from '../regulator/regulator.service';

describe('AuthController', () => {
  let controller: ClientAuthController;
  let clientAuthService: ClientAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientAuthController],
      providers: [
        mockClientAuthService,
        mockConfigService,
        mockLogger,
        RegulatorService,
      ],
    }).compile();

    controller = module.get<ClientAuthController>(ClientAuthController);
    clientAuthService = module.get<ClientAuthService>(ClientAuthService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call register user on magic link service', async () => {
      const req = mocks.createRequest({ session: {} });
      const registerSpy = jest
        .spyOn(clientAuthService, 'registerUser')
        .mockResolvedValue(DEFAULT_USER);

      await controller.registerPost({ email: 'email@e.com' }, req);
      expect(registerSpy).toBeCalledTimes(1);
    });
  });

  describe('loginPost', () => {
    it('should return the user and store challenge details on session', async () => {
      const req = mocks.createRequest({ session: {} });
      const result = await controller.loginPost({ email: 'email@e.com' }, req);

      expect(result).toEqual(magicLinkInitiationResponse);
      expect(req.session).toEqual({
        challengeSession: magicLinkInitiationResponse.Session,
        challengeUsername:
          magicLinkInitiationResponse.ChallengeParameters.USERNAME,
      });
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

  describe('deleteUserConfirm', () => {
    it('should call confirmPassword on auth service', async () => {
      const deleteSpy = jest
        .spyOn(clientAuthService, 'deleteUser')
        .mockResolvedValue(DEFAULT_USER);
      const destroyMock = jest.fn();
      await controller.deleteUserConfirm(
        DEFAULT_USER,
        mocks.createRequest({
          session: { destroy: destroyMock },
        }),
      );
      expect(deleteSpy).toBeCalledTimes(1);
      expect(deleteSpy).toBeCalledWith(DEFAULT_USER);
      expect(destroyMock).toBeCalledTimes(1);
    });
  });
});
