import { NestExpressApplication } from '@nestjs/platform-express';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { ServerConfig } from '../config';

export function useGovUi(app: NestExpressApplication) {
  app.setLocal('asset_path', '/assets/');
  app.setLocal('applicationName', 'BEIS ORM');

  nunjucks.configure(
    [
      path.resolve(path.join(__dirname, 'views')),
      'node_modules/govuk-frontend/',
      'node_modules/govuk-frontend/components/',
    ],
    {
      express: app.getHttpAdapter().getInstance(),
      autoescape: true,
    },
  );

  const serverConfig = app.get(ConfigService).get<ServerConfig>('server');
  app.useStaticAssets(path.join(__dirname, 'assets'), {
    prefix: '/assets',
    maxAge: serverConfig.staticResourceCacheDuration * 1000,
  });

  app.setBaseViewsDir(path.join(__dirname, 'views'));
  app.setViewEngine('njk');
}
