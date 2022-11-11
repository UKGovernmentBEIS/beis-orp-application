import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useGovUi } from '../src/server/bootstrap';
import { BlogModule } from '../src/server/blog/blog.module';
import { ConfigService } from '@nestjs/config';

describe('BlogController (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BlogModule],
      providers: [ConfigService],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    useGovUi(app);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('Building the Open Regulation Platform');
      });
  });
});
