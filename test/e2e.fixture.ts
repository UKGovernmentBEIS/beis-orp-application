import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/server/app.module';
import { useGovUi } from '../src/server/bootstrap';
import * as request from 'supertest';
import * as path from 'path';
import { getMockedConfig } from './mocks/config.mock';
import { ConfigService } from '@nestjs/config';
import { ApiKeyService } from '../src/server/auth/apiKey.service';
import { PrismaService } from '../src/server/prisma/prisma.service';

export class E2eFixture {
  private app: NestExpressApplication;

  async init() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: getMockedConfig,
      })
      .overrideProvider(ApiKeyService)
      .useValue({
        key: ({ key }) => {
          return key === 'regulator_key'
            ? {
                key: 'regulator_key',
                createdDate: new Date(),
                expiresDate: null,
                revoked: false,
                regulatorId: 'xxx',
                regulator: {
                  id: 'xxx',
                  name: 'Regulator',
                  domain: 'regulator.com',
                },
              }
            : null;
        },
      })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    this.app = moduleFixture.createNestApplication<NestExpressApplication>();
    useGovUi(this.app);
    this.app.setBaseViewsDir(
      path.join(__dirname, '..', 'src', 'server', 'views'),
    );
    await this.app.init();
  }

  request() {
    return request(this.app.getHttpServer());
  }
}
