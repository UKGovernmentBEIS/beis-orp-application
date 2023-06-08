import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthException } from './entities/auth-exception';
import { ClientAuthService } from './client-auth.service';
import { Request } from 'express';

@Injectable()
export class MagicLinkStrategy extends PassportStrategy(
  Strategy,
  'magic-link',
) {
  constructor(private clientAuthService: ClientAuthService) {
    super();
  }

  async validate(
    context: Request & {
      session: { challengeUsername?: string; challengeSession?: string };
    },
  ): Promise<any> {
    const { challengeUsername, challengeSession } = context.session;
    const { code } = context.query;

    if (
      !challengeUsername ||
      !challengeSession ||
      !code ||
      typeof code !== 'string'
    ) {
      throw new AuthException({
        code: 'NotAuthorizedException',
        message: 'invalid session for the user',
      });
    }

    const user = await this.clientAuthService.respondToAuthChallenge({
      code,
      username: challengeUsername,
      session: challengeSession,
    });

    if (!user) {
      throw new AuthException({ code: 'NotAuthorizedException' });
    }

    return user;
  }
}
