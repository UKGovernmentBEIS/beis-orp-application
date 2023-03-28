import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { ServerConfig } from '../config/application-config';

export function useGovUi(app: NestExpressApplication) {
  app.setLocal('asset_path', '/assets/');
  app.setLocal('applicationName', 'BEIS ORM');

  const serverConfig = app.get(ConfigService).get<ServerConfig>('server');
  app.useStaticAssets(path.join(__dirname, 'assets'), {
    prefix: '/assets',
    maxAge: serverConfig.staticResourceCacheDuration * 1000,
  });

  app.setBaseViewsDir(path.join(__dirname, 'views'));
  app.setViewEngine('ejs');
}
