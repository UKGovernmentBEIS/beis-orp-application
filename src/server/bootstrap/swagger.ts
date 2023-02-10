import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiModule } from '../api/api.module';

const swaggerDocumentOptions = {
  include: [ApiModule],
};

export function useSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle('BEIS ORP')
    .setDescription('The ORP API documentation')
    .setVersion('1.0')
    .addTag('search')
    .addTag('document')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(
    app,
    config,
    swaggerDocumentOptions,
  );
  SwaggerModule.setup('/api/docs', app, document, {
    customSiteTitle: 'ORP API documentation',
    customfavIcon: '/assets/images/favicon.ico',
    customCssUrl: '/assets/swagger.css',
    swaggerOptions: {
      layout: 'StandaloneLayout',
    },
  });
}
