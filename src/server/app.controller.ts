import { Controller, Get, Render } from '@nestjs/common';
import { AppService, IndexView } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('pages/index')
  getHello(): IndexView {
    return this.appService.getHello();
  }
}
