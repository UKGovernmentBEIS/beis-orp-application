import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useGovUi, useHelmet } from './bootstrap';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useSession } from './bootstrap/session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  useHelmet(app);
  useGovUi(app);
  useSession(app);

  await app.listen(3000);
}
bootstrap();
