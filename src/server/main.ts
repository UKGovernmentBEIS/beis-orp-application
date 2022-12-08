import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useGovUi, useHelmet } from './bootstrap';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useSession } from './bootstrap/session';
import { useSwagger } from './bootstrap/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  useHelmet(app);
  useGovUi(app);
  useSession(app);
  useSwagger(app);

  await app.listen(3000);
}
bootstrap();
