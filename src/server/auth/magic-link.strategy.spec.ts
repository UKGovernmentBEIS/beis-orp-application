import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { DEFAULT_USER_WITH_REGULATOR } from '../../../test/mocks/user.mock';
import { ClientAuthService } from './client-auth.service';
import { MagicLinkStrategy } from './magic-link.strategy';
import * as mocks from 'node-mocks-http';
import { Request } from 'express';
import { RegulatorService } from '../regulator/regulator.service';

describe('Magic Link Strategy', () => {
  let strategy: MagicLinkStrategy;
  let clientAuthService: ClientAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MagicLinkStrategy,
        ClientAuthService,
        mockConfigService,
        RegulatorService,
      ],
    }).compile();

    strategy = module.get<MagicLinkStrategy>(MagicLinkStrategy);
    clientAuthService = module.get<ClientAuthService>(ClientAuthService);
  });

  describe('validate', () => {
    it('should send code, username and session to clientAuthService', async () => {
      const returnedUser = DEFAULT_USER_WITH_REGULATOR;
      const request = mocks.createRequest({
        session: { challengeUsername: 'un', challengeSession: 'sess' },
        query: { code: '123456' },
      }) as Request;

      jest
        .spyOn(clientAuthService, 'respondToAuthChallenge')
        .mockResolvedValue(returnedUser);

      const result = await strategy.validate(request);
      expect(result).toEqual(returnedUser);
    });

    it('should throw AuthException if no challenge data in session', () => {
      const request = mocks.createRequest({
        session: {},
        query: { code: '123456' },
      }) as Request;

      expect(() => strategy.validate(request)).rejects.toThrow('Auth error');
    });

    it('should throw AuthException if no code in query', () => {
      const request = mocks.createRequest({
        session: { challengeUsername: 'un', challengeSession: 'sess' },
        query: {},
      }) as Request;

      expect(() => strategy.validate(request)).rejects.toThrow('Auth error');
    });

    it('should throw AuthException if user is not returned from service', () => {
      const returnedUser = null;
      const request = mocks.createRequest({
        session: { challengeUsername: 'un', challengeSession: 'sess' },
        query: { code: '123456' },
      }) as Request;

      jest
        .spyOn(clientAuthService, 'respondToAuthChallenge')
        .mockResolvedValue(returnedUser);

      expect(() => strategy.validate(request)).rejects.toThrow('Auth error');
    });
  });
});
