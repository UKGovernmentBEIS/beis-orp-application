import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { AuthException } from '../types/AuthException';

@Catch(AuthException)
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: AuthException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();

    if (exception.isNotAuthorized() || exception.isNotFound()) {
      if (request.url === 'auth/reset-password') {
        request.session.previousPassword = {
          global: 'Incorrect password',
        };
        return response.redirect('/auth/reset-password');
      }

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

    if (exception.isEmailInUse()) {
      request.session.errors = {
        global:
          'The email address provided is already in use.<br /><br /> If you can not remember your details you can <a href="/auth/new-password">reset your password</a>.',
      };
      return response.redirect(request.originalUrl);
    }

    if (exception.isLimitExceeded()) {
      request.session.destroy();
      return response.redirect('/auth/limit-exceeded');
    }

    this.logger.error(
      `Unhandled auth error: ${JSON.stringify(exception.errorObj)}`,
    );
    request.session.errors = {
      global: 'An error occurred during authentication, please try again',
    };
    return response.redirect('/auth/logout');
  }
}
