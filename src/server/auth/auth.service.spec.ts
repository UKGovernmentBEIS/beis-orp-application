import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockLogger } from '../../../test/mocks/logger.mock';
import {
  DEFAULT_PRISMA_USER,
  DEFAULT_PRISMA_USER_WITH_REGULATOR,
} from '../../../test/mocks/prismaService.mock';
import { AuthException } from './types/AuthException';

const mockCognito = {
  send: jest.fn().mockImplementation(() => 'COGNITO_RESPONSE'),
};
jest.mock('@aws-sdk/client-cognito-identity-provider', () => {
  return {
    AdminDeleteUserCommand: jest.fn((args) => ({
      ...args,
      adminDeleteUserCommand: true,
    })),
    AdminInitiateAuthCommand: jest.fn((args) => ({
      ...args,
      adminInitiateAuthCommand: true,
    })),
    AdminResetUserPasswordCommand: jest.fn((args) => ({
      ...args,
      adminResetUserPasswordCommand: true,
    })),
    CognitoIdentityProviderClient: jest.fn(() => mockCognito),
    ConfirmForgotPasswordCommand: jest.fn((args) => ({
      ...args,
      confirmForgotPasswordCommand: true,
    })),
    ResendConfirmationCodeCommand: jest.fn((args) => ({
      ...args,
      resendConfirmationCodeCommand: true,
    })),
    SignUpCommand: jest.fn((args) => ({ ...args, signUpCommand: true })),
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        mockConfigService,
        UserService,
        PrismaService,
        mockLogger,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register the user with the cognito user pool and save to db', async () => {
      const registerSpy = jest
        .spyOn(userService, 'createUser')
        .mockResolvedValue(DEFAULT_PRISMA_USER);
      const user = { email: 'e@mail.com', password: 'pw' };
      const result = await service.registerUser(user);
      expect(mockCognito.send).toBeCalledWith({
        ClientId: 'clid',
        signUpCommand: true,
        Username: user.email,
        Password: user.password,
      });
      expect(registerSpy).toBeCalledTimes(1);
      expect(registerSpy).toBeCalledWith(user.email);
      expect(result).toEqual(DEFAULT_PRISMA_USER);
    });

    it('should throw AuthException if cognito errors', async () => {
      const registerSpy = jest
        .spyOn(userService, 'createUser')
        .mockResolvedValue(DEFAULT_PRISMA_USER);

      mockCognito.send.mockRejectedValueOnce({ __type: 'error' });

      const user = { email: 'ALREADY_IN_USE', password: 'pw' };
      await expect(
        async () => await service.registerUser(user),
      ).rejects.toBeInstanceOf(AuthException);
      expect(registerSpy).toBeCalledTimes(0);
    });
  });

  describe('authenticateUser', () => {
    it('should call authenticateUser on congnitoUser and return user if success', async () => {
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockResolvedValue(DEFAULT_PRISMA_USER_WITH_REGULATOR);

      const user = {
        email: 'e@mail.com',
        password: 'pw',
      };

      const result = await service.authenticateUser(user);
      expect(mockCognito.send).toBeCalledWith({
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        ClientId: 'clid',
        UserPoolId: 'upid',
        AuthParameters: {
          USERNAME: user.email,
          PASSWORD: user.password,
        },
        adminInitiateAuthCommand: true,
      });
      expect(result).toEqual(DEFAULT_PRISMA_USER_WITH_REGULATOR);
    });

    it('should throw authError if rejected', async () => {
      const user = {
        email: 'e@mail.com',
        password: 'pw',
      };
      mockCognito.send.mockRejectedValueOnce({
        __type: 'NotAuthorizedException',
      });

      return expect(service.authenticateUser(user)).rejects.toBeInstanceOf(
        AuthException,
      );
    });
  });

  describe('resendConfirmationCode', () => {
    it('should call resendConfirmationCode on congnitoUser and return user if success', async () => {
      const result = await service.resendConfirmationCode('e@mail.com');
      expect(mockCognito.send).toBeCalledWith({
        ClientId: 'clid',
        Username: 'e@mail.com',
        resendConfirmationCodeCommand: true,
      });
      expect(result).toEqual('COGNITO_RESPONSE');
    });

    it('should throw authError if rejected', () => {
      mockCognito.send.mockRejectedValueOnce({
        __type: 'Error',
      });

      return expect(
        async () => await service.resendConfirmationCode('e@mail.com'),
      ).rejects.toBeInstanceOf(AuthException);
    });
  });

  describe('startResetPassword', () => {
    it('should call forgotPassword on congnitoUser and return result if success', async () => {
      const result = await service.startResetPassword(DEFAULT_PRISMA_USER);
      expect(mockCognito.send).toBeCalledWith({
        UserPoolId: 'upid',
        Username: DEFAULT_PRISMA_USER.email,
        adminResetUserPasswordCommand: true,
      });
      expect(result).toEqual('COGNITO_RESPONSE');
    });

    it('should throw if rejected', () => {
      mockCognito.send.mockRejectedValueOnce({
        __type: 'Error',
      });

      return expect(
        service.startResetPassword(DEFAULT_PRISMA_USER),
      ).rejects.toBeInstanceOf(AuthException);
    });
  });

  describe('confirmPassword', () => {
    it('should call confirmPassword on congnitoUser and return result if success', async () => {
      const result = await service.confirmPassword({
        verificationCode: 'correct',
        newPassword: 'pw',
        email: 'e@mail.com',
      });

      expect(mockCognito.send).toBeCalledWith({
        ClientId: 'clid',
        Username: 'e@mail.com',
        Password: 'pw',
        ConfirmationCode: 'correct',
        confirmForgotPasswordCommand: true,
      });

      expect(result).toEqual('COGNITO_RESPONSE');
    });

    it('should throw if rejected', () => {
      mockCognito.send.mockRejectedValueOnce({
        __type: 'Error',
      });
      return expect(
        service.confirmPassword({
          verificationCode: 'correct',
          newPassword: 'pw',
          email: 'e@mail.com',
        }),
      ).rejects.toBeInstanceOf(AuthException);
    });
  });

  describe('deleteUser', () => {
    it('should delete the user from the cognito user pool and from db', async () => {
      const userServiceDeleteSpy = jest
        .spyOn(userService, 'deleteUser')
        .mockResolvedValue(DEFAULT_PRISMA_USER);
      const result = await service.deleteUser(DEFAULT_PRISMA_USER);
      expect(mockCognito.send).toBeCalledWith({
        UserPoolId: 'upid',
        Username: DEFAULT_PRISMA_USER.email,
        adminDeleteUserCommand: true,
      });
      expect(userServiceDeleteSpy).toBeCalledTimes(1);
      expect(userServiceDeleteSpy).toBeCalledWith(DEFAULT_PRISMA_USER.email);
      expect(result).toEqual(DEFAULT_PRISMA_USER);
    });

    it('should throw AuthException if cognito errors', async () => {
      const userServiceDeleteSpy = jest
        .spyOn(userService, 'deleteUser')
        .mockResolvedValue(DEFAULT_PRISMA_USER);

      mockCognito.send.mockRejectedValueOnce({ __type: 'error' });

      await expect(
        async () => await service.deleteUser(DEFAULT_PRISMA_USER),
      ).rejects.toBeInstanceOf(AuthException);
      expect(userServiceDeleteSpy).toBeCalledTimes(0);
    });
  });
});
