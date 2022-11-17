import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useGovUi, useHelmet } from './bootstrap';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  useHelmet(app);
  useGovUi(app);

  await app.listen(3000);
}
bootstrap();
