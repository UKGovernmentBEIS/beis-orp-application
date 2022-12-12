import { ConfigService } from '@nestjs/config';
import { Config } from '../../src/server/config';

export const mockConfigService = {
  provide: ConfigService,
  useValue: {
    get: getMockedConfig,
  },
};

export function getMockedConfig(key): Partial<Config> {
  const config = {
    domain: 'https://test.com/',
    server: {
      staticResourceCacheDuration: 20,
    },
    apis: {
      mailchimp: {
        apiKey: 'mc_key',
        server: 'mc_server',
        list: 'mc_list',
      },
    },
    aws: {
      ingestionBucket: 'bucket',
    },
    secrets: {
      uploadKey: 'upload_key',
    },
  };

  return config[key];
}
