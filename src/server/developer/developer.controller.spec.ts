import { Test, TestingModule } from '@nestjs/testing';
import { DeveloperController } from './developer.controller';
import { ApiAuthService } from '../auth/api-auth.service';
import { DEFAULT_API_CREDENTIAL } from '../../../test/mocks/cognitoApiCred.mock';
import { DEFAULT_PRISMA_USER } from '../../../test/mocks/prismaService.mock';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { UserService } from '../user/user.service';
import { RegulatorService } from '../regulator/regulator.service';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DeveloperController', () => {
  let controller: DeveloperController;
  let apiAuthService: ApiAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeveloperController],
      providers: [
        ApiAuthService,
        mockConfigService,
        UserService,
        RegulatorService,
        mockLogger,
        AuthService,
        PrismaService,
      ],
    }).compile();

    controller = module.get<DeveloperController>(DeveloperController);
    apiAuthService = module.get<ApiAuthService>(ApiAuthService);
  });

  describe('apiKeys', () => {
    it('should get existing API credentials and return them', async () => {
      jest
        .spyOn(apiAuthService, 'getApiClientsForUser')
        .mockResolvedValue([DEFAULT_API_CREDENTIAL]);

      const result = await controller.apiKeys(DEFAULT_PRISMA_USER);
      expect(result).toEqual({ creds: [DEFAULT_API_CREDENTIAL] });
    });
  });

  describe('generateApiKeys', () => {
    it('should get existing API credentials and register new ones', async () => {
      jest
        .spyOn(apiAuthService, 'getApiClientsForUser')
        .mockResolvedValue([DEFAULT_API_CREDENTIAL]);

      const newCreds = { clientId: '1', clientSecret: 'sec' };
      jest.spyOn(apiAuthService, 'registerClient').mockResolvedValue(newCreds);

      const result = await controller.generateApiKeys(DEFAULT_PRISMA_USER);
      expect(result).toEqual({
        creds: [DEFAULT_API_CREDENTIAL],
        newCreds: newCreds,
      });
    });
  });
});
