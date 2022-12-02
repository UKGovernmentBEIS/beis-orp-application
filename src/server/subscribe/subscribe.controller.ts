import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Session,
  UseFilters,
} from '@nestjs/common';
import { SubscriberDto } from './types/Subscriber.dto';
import { SubscribeService } from './subscribe.service';
import { ValidateAndRender } from '../validation';
import { MailchimpExceptionFilter } from './filters/mailchimpError.filter';
import { UserPreferenceDto } from './types/UserPreference.dto';

@UseFilters(new MailchimpExceptionFilter())
@Controller('subscribe')
export class SubscribeController {
  constructor(private subscribeService: SubscribeService) {}

  @Get()
  @Render('pages/subscribe/index')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  renderSignup() {}

  @Post()
  @ValidateAndRender('pages/subscribe/index', 'pages/subscribe/success')
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
  @ValidateAndRender('pages/subscribe/manage', 'pages/subscribe/success')
  async updateSubscription(@Body() userPreferenceDto: UserPreferenceDto) {
    await this.subscribeService.updatePreference(userPreferenceDto);
    return userPreferenceDto;
  }
}
