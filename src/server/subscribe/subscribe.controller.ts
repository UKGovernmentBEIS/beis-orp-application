import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Session,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { SubscriberDto } from './types/Subscriber.dto';
import { SubscribeService } from './subscribe.service';
import { MailchimpExceptionFilter } from './filters/mailchimpError.filter';
import { UserPreferenceDto } from './types/UserPreference.dto';
import { ErrorFilter } from '../error.filter';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';
import { ValidateForm } from '../form-validation';

@UseFilters(new MailchimpExceptionFilter())
@UseFilters(ErrorFilter)
@UseInterceptors(ViewDataInterceptor)
@Controller('subscribe')
export class SubscribeController {
  constructor(private subscribeService: SubscribeService) {}

  @Get()
  @Render('pages/subscribe/index')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  renderSignup() {}

  @Post()
  @ValidateForm()
  @Render('pages/subscribe/success')
  subscribe(
    @Session() session: Record<string, any>,
    @Body() subscriberDto: SubscriberDto,
  ) {
    session.emailAddress = subscriberDto.emailAddress;
    return this.subscribeService.subscribeUser(subscriberDto);
  }

  @Get('/manage')
  @Render('pages/subscribe/manage')
  manageSubscription(@Session() session: Record<string, any>) {
    return {
      model: {
        emailAddress: session.emailAddress,
      },
    };
  }

  @Post('/manage')
  @ValidateForm()
  @Render('pages/subscribe/success')
  async updateSubscription(@Body() userPreferenceDto: UserPreferenceDto) {
    await this.subscribeService.updatePreference(userPreferenceDto);
    return userPreferenceDto;
  }
}
