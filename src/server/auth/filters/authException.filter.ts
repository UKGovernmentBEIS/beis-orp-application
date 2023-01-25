import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AuthException } from '../types/AuthException';

@Catch(AuthException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: AuthException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();

    if (exception.isNotAuthorized()) {
      request.session.errors = {
        global: 'Incorrect email address or password',
      };
      return response.redirect('/auth/login');
    }

    if (exception.isBadRequest()) {
      request.session.errors = {
        email: exception.errorObj.meta.emailProvided
          ? undefined
          : 'Enter an email address in the correct format, like name@example.com',
        password: exception.errorObj.meta.passwordProvided
          ? undefined
          : 'Enter a password',
      };
      return response.redirect('/auth/login');
    }

    if (exception.isUnconfirmed()) {
      request.session.unconfirmedEmail = exception.errorObj.meta.email;
      return response.redirect('/auth/unconfirmed');
    }

    return response.redirect('/');
  }
}
