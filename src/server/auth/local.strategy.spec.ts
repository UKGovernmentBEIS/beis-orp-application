import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { LocalStrategy } from './local.strategy';
import { CORRECT_EMAIL, CORRECT_PW } from '../../../test/e2e.fixture';
import { mockAuthService } from '../../../test/mocks/authService.mock';
import { DEFAULT_PRISMA_USER_WITH_REGULATOR } from '../../../test/mocks/prismaService.mock';

describe('AuthService', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStrategy, mockAuthService, mockConfigService],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  describe('validate', () => {
    it('should return the user if it comes back from authService', async () => {
      const returnedUser = DEFAULT_PRISMA_USER_WITH_REGULATOR;
      jest
        .spyOn(authService, 'authenticateUser')
        .mockResolvedValue(returnedUser);

      const result = await strategy.validate(CORRECT_EMAIL, CORRECT_PW);
      expect(result).toEqual(returnedUser);
    });

    it('should throw AuthException if user is not returned from service', () => {
      const returnedUser = null;
      jest
        .spyOn(authService, 'authenticateUser')
        .mockResolvedValue(returnedUser);

      expect(() => strategy.validate(CORRECT_EMAIL, 'WRONG')).rejects.toThrow(
        'Auth error',
      );
    });
  });
});
