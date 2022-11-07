import { Injectable } from '@nestjs/common';

export interface IndexView {
  title: string;
  msg: string;
}

@Injectable()
export class AppService {
  getHello(): IndexView {
    return {
      title: 'This site is under construction',
      msg: 'Please check back later when there is content to view.',
    };
  }
}
