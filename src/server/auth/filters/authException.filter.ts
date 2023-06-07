import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthException } from '../types/AuthException';

@Catch(AuthException)
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: AuthException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();

    if (exception.isInvalidSession()) {
      request.session.errors = {
        global: 'Sign in process timed out. Please try again',
      };
      return response.redirect('/auth/login');
    }

    if (exception.isNotAuthorized() || exception.isNotFound()) {
      return response.redirect('/auth/email-sent');
    }

    if (exception.isCodeMismatch()) {
      request.session.errors = {
        verificationCode: 'Incorrect security code entered',
      };
      return response.redirect(request.url);
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
      request.session.values = {
        email: exception.errorObj.meta.emailValue,
      };
      return response.redirect('/auth/login');
    }

    if (exception.isUnconfirmed()) {
      request.session.unconfirmedEmail = exception.errorObj.meta.email;
      return response.redirect('/auth/unconfirmed');
    }

    if (exception.isEmailInUse()) {
      request.session.errors = {
        global: 'The email address provided is already in use.',
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
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .render('pages/error', {
        title:
          'Sorry, there is a problem with the service – The Open Regulation Platform – GOV.UK',
      });
  }
}
