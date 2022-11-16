import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { SubscriberDto } from './Subscriber.dto';
import { SubscribeService } from './subscribe.service';

@Controller('subscribe')
export class SubscribeController {
  constructor(private subscribeService: SubscribeService) {}

  @Get()
  @Render('pages/subscribe/index')
  renderSignup() {}

  @Post()
  @Render('pages/subscribe/success')
  subscribe(@Body() subscriberDto: SubscriberDto) {
    return this.subscribeService.subscribeUser(subscriberDto);
  }
}
