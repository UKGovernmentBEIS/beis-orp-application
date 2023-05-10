import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as snakecaseKeys from 'snakecase-keys';

export interface Response<T> {
  data: T;
}
@Injectable()
export class SnakeCaseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(map((data) => snakecaseKeys<any, T>(data)));
  }
}
