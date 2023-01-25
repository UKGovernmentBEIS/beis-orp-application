import { NestExpressApplication } from '@nestjs/platform-express';
import * as passport from 'passport';

export function usePassport(app: NestExpressApplication) {
  app.use(passport.initialize());
  app.use(passport.session());
}
