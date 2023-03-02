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

type MenuItem = 'search' | 'upload' | 'dev' | 'blog';
const getMenuItem = (url: string): MenuItem | null => {
  if (url === '' || url.includes('blog')) return 'blog';
  if (url.includes('search') || url.includes('document')) return 'search';
  if (url.includes('ingest') || url.includes('document')) return 'upload';
  if (url.includes('developer')) return 'dev';
  return null;
};

// adds the user object and flash errors to response for views to display
@Injectable()
export class ViewDataInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const errors = request.session.errors;
    const values = request.session.values;
    request.session.errors = undefined;
    request.session.values = undefined;
    const latestSearch = request.session.latestSearch ?? '/search';

    return next.handle().pipe(
      map((data) => ({
        ...data,
        user: request.user,
        errors,
        values,
        menuItem: getMenuItem(request.url),
        latestSearch,
      })),
    );
  }
}
