import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MailchimpException } from '../entities/types';

@Catch(MailchimpException)
export class MailchimpExceptionFilter implements ExceptionFilter {
  catch(exception: MailchimpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception.isEmailInUse()) {
      return response.redirect('/subscribe/manage');
    }

    return response.redirect('/subscribe');
  }
}
