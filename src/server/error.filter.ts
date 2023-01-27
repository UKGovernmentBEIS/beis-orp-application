import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HealthError } from './health/types';
import { FormValidationException } from './form-validation';

@Catch()
export class ErrorFilter<T extends Error> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();

    if (exception instanceof HealthError) {
      return response
        .status(HttpStatus.SERVICE_UNAVAILABLE)
        .json(exception.health);
    }

    if (exception instanceof FormValidationException) {
      request.session.errors = exception.viewModel.errors;

      return response
        .status(HttpStatus.BAD_REQUEST)
        .redirect(request.originalUrl);
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    switch (status) {
      case HttpStatus.FORBIDDEN:
      case HttpStatus.UNAUTHORIZED:
        return response.redirect('/auth/logout');
      default:
        return response.status(status).render('pages/error', {
          message: exception.message,
          status,
          stack: exception.stack,
        });
    }
  }
}
