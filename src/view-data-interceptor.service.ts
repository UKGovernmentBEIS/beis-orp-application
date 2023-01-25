import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

// adds the user object and flash errors to response for views to display
@Injectable()
export class ViewDataInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const errors = request.session.errors;
    request.session.errors = undefined;
    return next.handle().pipe(
      map((data) => ({
        ...data,
        user: request.user,
        errors,
      })),
    );
  }
}
