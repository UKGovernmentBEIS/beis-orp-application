import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { DEFAULT_USER_WITH_REGULATOR } from '../../../test/mocks/user.mock';
import { MagicLinkService } from './magic-link.service';
import { MagicLinkStrategy } from './magic-link.strategy';
import * as mocks from 'node-mocks-http';
import { Request } from 'express';
import { RegulatorService } from '../regulator/regulator.service';

describe('Magic Link Strategy', () => {
  let strategy: MagicLinkStrategy;
  let magicLinkService: MagicLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MagicLinkStrategy,
        MagicLinkService,
        mockConfigService,
        RegulatorService,
      ],
    }).compile();

    strategy = module.get<MagicLinkStrategy>(MagicLinkStrategy);
    magicLinkService = module.get<MagicLinkService>(MagicLinkService);
  });

  describe('validate', () => {
    it('should send code, username and session to magicLinkService', async () => {
      const returnedUser = DEFAULT_USER_WITH_REGULATOR;
      const request = mocks.createRequest({
        session: { challengeUsername: 'un', challengeSession: 'sess' },
        query: { code: '123456' },
      }) as Request;

      jest
        .spyOn(magicLinkService, 'respondToAuthChallenge')
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
        .spyOn(magicLinkService, 'respondToAuthChallenge')
        .mockResolvedValue(returnedUser);

      expect(() => strategy.validate(request)).rejects.toThrow('Auth error');
    });
  });
});
