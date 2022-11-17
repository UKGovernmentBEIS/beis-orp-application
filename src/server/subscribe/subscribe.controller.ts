import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { SubscriberDto } from './Subscriber.dto';
import { SubscribeService } from './subscribe.service';
import { ValidateAndRender } from '../validation';

@Controller('subscribe')
export class SubscribeController {
  constructor(private subscribeService: SubscribeService) {}

  @Get()
  @Render('pages/subscribe/index')
  renderSignup() {}

  @Post()
  @ValidateAndRender('pages/subscribe/index')
  async subscribe(@Res() res, @Body() subscriberDto: SubscriberDto) {
    try {
      await this.subscribeService.subscribeUser(subscriberDto);
      return res.redirect('/subscribe/success');
    } catch (e) {
      return { mailchimpError: true };
    }
  }

  @Get('success')
  @Render('pages/subscribe/success')
  success() {}
}
