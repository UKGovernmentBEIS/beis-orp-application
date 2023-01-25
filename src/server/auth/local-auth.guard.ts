import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthException } from './types/AuthException';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const input = context.switchToHttp().getRequest().body;
    if (!input.password || !input.email) {
      throw new AuthException({
        code: 'ValidationException',
        meta: {
          emailProvided: !!input.email,
          passwordProvided: !!input.password,
        },
      });
    }

    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}
