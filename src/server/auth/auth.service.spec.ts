import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { AuthException } from './types/AuthException';

const mockCogUserPool = {
  signUp: (email, password, userAttributes, validationData, callback) =>
    callback(undefined, { user: 'USER_MOCK' }),
};

const mockCogUser = {
  authenticateUser: (authDetails, callbacks) => callbacks.onSuccess(),
  resendConfirmationCode: (callback) => callback(null, 'RESEND_RESULT'),
};

jest.mock('amazon-cognito-identity-js', () => {
  return {
    CognitoUserPool: jest.fn(() => mockCogUserPool),
    AuthenticationDetails: jest.fn((args) => args),
    CognitoUser: jest.fn(() => mockCogUser),
  };
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, mockConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('registerUser', () => {
    it('should register the user with the cognito user pool', async () => {
      const user = {
        email: 'e@mail.com',
        password: 'pw',
      };
      const result = await service.registerUser(user);
      expect(result).toEqual('USER_MOCK');
    });
  });

  describe('authenticateUser', () => {
    it('should call authenticateUser on congnitoUser and return user if success', async () => {
      const user = {
        email: 'e@mail.com',
        password: 'pw',
      };
      const result = await service.authenticateUser(user);
      expect(result).toEqual({ email: user.email });
    });

    it('should throw authError if rejected', async () => {
      mockCogUser.authenticateUser = (authDetails, callbacks) =>
        callbacks.onFailure({ code: 'NotAuthorizedException' });
      const user = {
        email: 'e@mail.com',
        password: 'pw',
      };
      await expect(service.authenticateUser(user)).rejects.toBeInstanceOf(
        AuthException,
      );
    });
  });

  describe('resendConfirmationCode', () => {
    it('should call resendConfirmationCode on congnitoUser and return user if success', async () => {
      const result = await service.resendConfirmationCode('e@mail.com');
      expect(result).toEqual('RESEND_RESULT');
    });

    it('should throw authError if rejected', async () => {
      mockCogUser.resendConfirmationCode = (callback) =>
        callback('ERROR', 'RESEND_RESULT');
      await expect(
        service.resendConfirmationCode('e@mail.com'),
      ).rejects.toEqual('ERROR');
    });
  });
});
