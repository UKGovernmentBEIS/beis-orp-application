import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Secrets } from '../config';
import { ApiKeyService } from './apiKey.service';
import { ApiKey, Regulator } from '@prisma/client';

type RegulatorKey = ApiKey &
  Required<Pick<ApiKey, 'key'>> & {
    regulator: Regulator;
  };
export const isRegulatorKey = (key: ApiKey): key is RegulatorKey =>
  !!key.regulatorId;

@Injectable()
export class AuthGuard implements CanActivate {
  private secret: string;

  constructor(
    private config: ConfigService,
    private apiKeyService: ApiKeyService,
  ) {
    this.secret = config.get<Secrets>('secrets').uploadKey;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const keySupplied = request.headers['x-orp-auth-token'];
    if (!keySupplied) return false;

    const apiKey = await this.apiKeyService.key({
      key: request.headers['x-orp-auth-token'],
    });

    if (!apiKey) return false;

    if (!apiKey.revoked && isRegulatorKey(apiKey)) {
      request.regulator = apiKey.regulator.name;
      return true;
    }
  }
}
