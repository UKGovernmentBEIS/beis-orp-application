import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { mockLogger } from '../../../test/mocks/logger.mock';
import {
  DEFAULT_REGULATOR,
  DEFAULT_USER,
  DEFAULT_USER_WITH_REGULATOR,
} from '../../../test/mocks/user.mock';
import { AuthException } from './types/AuthException';
import { RegulatorService } from '../regulator/regulator.service';
import { COGNITO_SUCCESSFUL_RESPONSE_REGULATOR } from '../../../test/mocks/cognitoSuccessfulResponse';
import { ClientAuthService } from './client-auth.service';
import { magicLinkInitiationResponse } from '../../../test/mocks/magicLink.mock';

const mockCognito = {
  send: jest.fn().mockImplementation(() => 'COGNITO_RESPONSE'),
};

jest.mock('uuid', () => {
  return { v4: jest.fn(() => 'UUID') };
});
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
    RespondToAuthChallengeCommand: jest.fn((args) => ({
      ...args,
      respondToAuthChallengeCommand: true,
    })),
    CognitoIdentityProviderClient: jest.fn(() => mockCognito),
    SignUpCommand: jest.fn((args) => ({ ...args, signUpCommand: true })),
  };
});

describe('ClientAuthService', () => {
  let service: ClientAuthService;
  let regulatorService: RegulatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientAuthService,
        mockConfigService,
        mockLogger,
        RegulatorService,
      ],
    }).compile();

    service = module.get<ClientAuthService>(ClientAuthService);
    regulatorService = module.get<RegulatorService>(RegulatorService);

    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register the user with the cognito user pool', async () => {
      const args = { email: 'e@mail.com' };
      await service.registerUser(args);
      expect(mockCognito.send).toBeCalledWith({
        ClientId: 'clid',
        signUpCommand: true,
        Username: args.email,
        Password: 'UUID',
      });
    });

    it('should throw AuthException if cognito errors', async () => {
      mockCognito.send.mockRejectedValueOnce({ __type: 'error' });

      const args = { email: 'e@mail.com' };
      await expect(
        async () => await service.registerUser(args),
      ).rejects.toBeInstanceOf(AuthException);
    });
  });

  describe('Magic link flow', () => {
    describe('initiateAuthentication', () => {
      it('should send AdminInitiateAuthCommand', async () => {
        mockCognito.send.mockResolvedValueOnce(magicLinkInitiationResponse);
        const args = { email: 'e@mail.com' };

        const result = await service.initiateAuthentication(args);
        expect(mockCognito.send).toBeCalledWith({
          AuthFlow: 'CUSTOM_AUTH',
          ClientId: 'clid',
          UserPoolId: 'upid',
          AuthParameters: {
            USERNAME: args.email,
          },
          adminInitiateAuthCommand: true,
        });
        expect(result).toMatchObject(magicLinkInitiationResponse);
      });

      it('should throw authError if rejected', async () => {
        const args = { email: 'e@mail.com' };
        mockCognito.send.mockRejectedValueOnce({
          __type: 'NotAuthorizedException',
        });

        return expect(
          service.initiateAuthentication(args),
        ).rejects.toBeInstanceOf(AuthException);
      });
    });

    describe('respondToAuthChallenge', () => {
      it('should send RespondToAuthChallengeCommand and return user if success', async () => {
        mockCognito.send.mockResolvedValueOnce(
          COGNITO_SUCCESSFUL_RESPONSE_REGULATOR,
        );

        jest
          .spyOn(regulatorService, 'getRegulatorByEmail')
          .mockReturnValue(DEFAULT_REGULATOR);

        const args = {
          username: DEFAULT_USER_WITH_REGULATOR.cognitoUsername,
          session: 'session',
          code: '123456',
        };

        const result = await service.respondToAuthChallenge(args);
        expect(mockCognito.send).toBeCalledWith({
          ChallengeName: 'CUSTOM_CHALLENGE',
          ClientId: 'clid',
          ChallengeResponses: {
            USERNAME: args.username,
            ANSWER: args.code,
          },
          Session: args.session,
          respondToAuthChallengeCommand: true,
        });
        expect(result).toMatchObject({
          email: 'matt.whitfield@public.io', // from COGNITO_SUCCESSFUL_RESPONSE_REGULATOR id token
          regulator: DEFAULT_REGULATOR,
        });
      });

      it('should throw authError if rejected', async () => {
        const args = {
          username: DEFAULT_USER_WITH_REGULATOR.cognitoUsername,
          session: 'session',
          code: '123456',
        };
        mockCognito.send.mockRejectedValueOnce({
          __type: 'NotAuthorizedException',
        });

        return expect(
          service.respondToAuthChallenge(args),
        ).rejects.toBeInstanceOf(AuthException);
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete the user from the cognito user pool and from db', async () => {
      await service.deleteUser(DEFAULT_USER);
      expect(mockCognito.send).toBeCalledWith({
        UserPoolId: 'upid',
        Username: DEFAULT_USER.email,
        adminDeleteUserCommand: true,
      });
    });

    it('should throw AuthException if cognito errors', async () => {
      mockCognito.send.mockRejectedValueOnce({ __type: 'error' });

      await expect(
        async () => await service.deleteUser(DEFAULT_USER),
      ).rejects.toBeInstanceOf(AuthException);
    });
  });
});
