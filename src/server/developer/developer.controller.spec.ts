import { Test, TestingModule } from '@nestjs/testing';
import { DeveloperController } from './developer.controller';
import { ApiAuthService } from '../auth/api-auth.service';
import { DEFAULT_API_CREDENTIAL } from '../../../test/mocks/cognitoApiCred.mock';
import { DEFAULT_USER } from '../../../test/mocks/user.mock';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { RegulatorService } from '../regulator/regulator.service';
import { mockLogger } from '../../../test/mocks/logger.mock';

describe('DeveloperController', () => {
  let controller: DeveloperController;
  let apiAuthService: ApiAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeveloperController],
      providers: [
        ApiAuthService,
        mockConfigService,
        RegulatorService,
        mockLogger,
      ],
    }).compile();

    controller = module.get<DeveloperController>(DeveloperController);
    apiAuthService = module.get<ApiAuthService>(ApiAuthService);
  });

  describe('apiKeys', () => {
    it('should render existingCredentials view with creds for user', async () => {
      jest
        .spyOn(apiAuthService, 'getApiClientsForUser')
        .mockResolvedValue([DEFAULT_API_CREDENTIAL]);

      const result = await controller.apiKeys(DEFAULT_USER);

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

      const result = await controller.generateApiKeys(DEFAULT_USER);
      expect(result).toEqual({
        newCreds: newCreds,
      });
    });
  });

  describe('deleteApiClient', () => {
    it('should call deleteApiClient on auth service', async () => {
      const deleteMock = jest
        .spyOn(apiAuthService, 'deleteApiClient')
        .mockResolvedValue([DEFAULT_API_CREDENTIAL]);

      await controller.deleteApiClient(DEFAULT_USER, {
        username: 'abc',
      });
      expect(deleteMock).toBeCalledWith('abc');
    });
  });
});
