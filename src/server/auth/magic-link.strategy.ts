import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthException } from './types/AuthException';
import { MagicLinkService } from './magic-link.service';
import { Request } from 'express';

@Injectable()
export class MagicLinkStrategy extends PassportStrategy(
  Strategy,
  'magic-link',
) {
  constructor(private magicLinkService: MagicLinkService) {
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
      throw new AuthException({ code: 'NotAuthorizedException' });
    }

    const user = await this.magicLinkService.respondToAuthChallenge({
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
