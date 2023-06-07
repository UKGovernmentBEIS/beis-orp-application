import { Test, TestingModule } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { DEFAULT_USER } from '../../../test/mocks/user.mock';
import { mockMagicLinkService } from '../../../test/mocks/magicLinkService.mock';
import { MagicLinkService } from './magic-link.service';
import { MagicLinkController } from './magic-link.controller';
import { magicLinkInitiationResponse } from '../../../test/mocks/magicLink.mock';

describe('AuthController', () => {
  let controller: MagicLinkController;
  let magicLinkService: MagicLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MagicLinkController],
      providers: [mockMagicLinkService, mockConfigService, mockLogger],
    }).compile();

    controller = module.get<MagicLinkController>(MagicLinkController);
    magicLinkService = module.get<MagicLinkService>(MagicLinkService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call register user on magic link service', async () => {
      const req = mocks.createRequest({ session: {} });
      const registerSpy = jest
        .spyOn(magicLinkService, 'registerUser')
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
        .spyOn(magicLinkService, 'deleteUser')
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
