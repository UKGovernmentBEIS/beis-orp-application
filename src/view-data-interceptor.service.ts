import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { pdfMimeType, wordMimeType } from './server/document/utils/mimeTypes';
import pageTitles from './server/config/page-titles';

export interface Response<T> {
  data: T;
}

type MenuItem = 'search' | 'upload' | 'dev' | 'blog' | 'uploaded-docs';
const getMenuItem = (url: string): MenuItem | null => {
  if (url === '' || url.includes('blog')) return 'blog';
  if (url.includes('uploaded-documents')) return 'uploaded-docs';
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

    const defaultTitle = pageTitles[request.url.split('?')[0]];
    const isErrors = errors && Object.keys(errors).length > 0;

    return next.handle().pipe(
      map((data) => ({
        ...data,
        user: request.user,
        errors,
        values,
        menuItem: getMenuItem(request.url),
        latestSearch,
        iframeMimeType: wordMimeType,
        objectMimeType: pdfMimeType,
        title: `${isErrors ? 'Error: ' : ''}${
          data?.title ?? defaultTitle
        } - The Open Regulation Platform`,
      })),
    );
  }
}
