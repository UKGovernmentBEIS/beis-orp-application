import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';

export function useSession(app: NestExpressApplication) {
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
}
