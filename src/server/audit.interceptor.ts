import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from './auth/entities/user';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger, private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const audit = this.reflector.get<string[]>('audit', context.getHandler());
    const { user, body }: { user: User; body: Record<string, string> } = context
      .switchToHttp()
      .getRequest();

    return next.handle().pipe(
      tap((value) => {
        if (!audit || !audit.length) return;

        const baseMeta = {
          user: user.cognitoUsername,
          regulator: user.regulator.id,
        };
        const auditMeta = audit.reduce((meta, item) => {
          const auditValue = value[item] ?? body[item] ?? item;
          const key = auditValue === item ? 'event' : item;
          return { ...meta, [key]: auditValue };
        }, baseMeta);

        return this.logger.log(`AUDITED_EVENT: ${JSON.stringify(auditMeta)}`);
      }),
    );
  }
}

export const Audit = (...audit: string[]) => SetMetadata('audit', audit);
