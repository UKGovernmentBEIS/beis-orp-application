import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import RedisStore from 'connect-redis';
import * as redis from 'redis';
import { ConfigService } from '@nestjs/config';
import { Redis, Secrets } from '../config/application-config';

export function useSession(app: NestExpressApplication) {
  const config = app.get(ConfigService);
  const { address, port } = config.get<Redis>('redis');
  const { session: secret } = config.get<Secrets>('secrets');

  const redisClient = redis.createClient({ socket: { host: address, port } });
  redisClient.connect().catch(console.error);

  const redisStore = new RedisStore({ client: redisClient });
  const sess = {
    store: redisStore,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  };

  if (config.get('isProduction')) {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
  }

  app.use(session(sess));
}
