import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

export function useHelmet(app: NestExpressApplication) {
  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet

  const awsConfig = app.get(ConfigService).get('aws');

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          // Hash allows inline script pulled in from https://github.com/alphagov/govuk-frontend/blob/master/src/govuk/template.njk
          scriptSrc: [
            "'self'",
            "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
            "'sha256-2b+Gm87u3WRLxfnN+NOZHjz1c6wcU7grMX2FhtC02OA='",
          ],
          styleSrc: ["'self'", 'code.jquery.com'],
          fontSrc: ["'self'"],
          frameSrc: [
            "'self'",
            'youtube.com',
            `${awsConfig.ingestionBucket}.s3.${awsConfig.region}.amazonaws.com`,
          ],
          objectSrc: [
            "'self'",
            `${awsConfig.ingestionBucket}.s3.${awsConfig.region}.amazonaws.com`,
          ],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );
}
