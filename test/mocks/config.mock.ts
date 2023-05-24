import { ConfigService } from '@nestjs/config';
import { ApplicationConfig } from '../../src/server/config/application-config';

export const mockConfigService = {
  provide: ConfigService,
  useValue: {
    get: getMockedConfig,
  },
};

export const mockedSearchLambda = 'http://www.searchapi.com';
export const mockedUrlLambda = 'http://www.ingesturl.com';
export const mockedDeleteLambda = 'http://www.delete.com';

export function getMockedConfig(key): Partial<ApplicationConfig> {
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
      orpSearch: {
        url: mockedSearchLambda,
      },
      urlIngestion: {
        url: mockedUrlLambda,
      },
      documentDeletion: {
        url: mockedDeleteLambda,
      },
    },
    aws: {
      ingestionBucket: 'bucket',
      region: 'eu-west-2',
      cognito: {
        userPoolId: 'upid',
        clientId: 'clid',
        apiUserPoolId: 'apiUpId',
        apiClientId: 'apiClId',
      },
    },
    secrets: {
      uploadKey: 'upload_key',
      session: 'my_secret',
    },
    environmentRegulators: 'public.io,mdrx.tech',
  };

  return config[key];
}
