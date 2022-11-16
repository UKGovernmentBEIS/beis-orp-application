import { ConfigService } from '@nestjs/config';
import { Config } from '../src/server/config';

export const mockConfigService = {
  provide: ConfigService,
  useValue: {
    get: config,
  },
};

function config(key): Partial<Config> {
  const config = {
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
  };

  return config[key];
}
