import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useGovUi, useHelmet } from './bootstrap';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  useHelmet(app);
  useGovUi(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
