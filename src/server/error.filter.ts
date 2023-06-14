import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HealthError } from './health/types';
import {
  FileValidationException,
  FormValidationException,
} from './form-validation';
import { InvalidDomainException } from './auth/entities/invalid-domain.exception';

@Catch()
export class ErrorFilter<T extends Error> implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: T, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();

    if (exception instanceof HealthError) {
      return response
        .status(HttpStatus.SERVICE_UNAVAILABLE)
        .json(exception.health);
    }

    if (exception instanceof InvalidDomainException) {
      return response.redirect('/auth/invalid-domain');
    }

    if (exception instanceof FileValidationException) {
      if (exception.template) {
        request.session.errors = { 'file-upload': exception.errors };
        return response
          .status(HttpStatus.BAD_REQUEST)
          .redirect(request.originalUrl);
      }
    }

    if (exception instanceof FormValidationException) {
      request.session.errors = exception.viewModel.errors;
      request.session.values = exception.viewModel.model;

      return response
        .status(HttpStatus.BAD_REQUEST)
        .redirect(
          exception.viewModel.returnPathOverride ?? request.originalUrl,
        );
    }

    if (exception instanceof ForbiddenException) {
      const redirectUrl = request.originalUrl.includes('ingest')
        ? '/unauthorised/ingest'
        : request.originalUrl.includes('developer')
        ? '/unauthorised/developer'
        : null;

      if (redirectUrl) {
        return response.redirect(redirectUrl);
      }
    }

    if (exception instanceof NotFoundException) {
      return response.status(HttpStatus.NOT_FOUND).render('pages/notFound', {
        title: 'Page not found – The Open Regulation Platform – GOV.UK',
      });
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
        this.logger.error(
          `Unhandled error: ${exception.message}`,
          exception.stack,
        );
        return response.status(status).render('pages/error', {
          title:
            'Sorry, there is a problem with the service – The Open Regulation Platform – GOV.UK',
        });
    }
  }
}
