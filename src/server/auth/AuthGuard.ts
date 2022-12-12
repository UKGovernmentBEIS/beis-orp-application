import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Secrets } from '../config';

@Injectable()
export class AuthGuard implements CanActivate {
  private secret: string;

  constructor(private config: ConfigService) {
    this.secret = config.get<Secrets>('secrets').uploadKey;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    return request.headers['x-orp-auth-token'] === this.secret;
  }
}
