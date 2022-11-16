import { Injectable } from '@nestjs/common';
import { SubscriberDto } from './Subscriber.dto';
import * as mailchimp from '@mailchimp/mailchimp_marketing';
import { ConfigService } from '@nestjs/config';
import { ApisConfig } from '../config';

@Injectable()
export class SubscribeService {
  private mcConfig: ApisConfig['mailchimp'];

  constructor(config: ConfigService) {
    this.mcConfig = config.get<ApisConfig>('apis').mailchimp;

    mailchimp.setConfig({
      apiKey: this.mcConfig.apiKey,
      server: this.mcConfig.server,
    });
  }

  subscribeUser(user: SubscriberDto) {
    return mailchimp.lists.addListMember(this.mcConfig.list, {
      email_address: user.email_address,
      status: 'subscribed',
      merge_fields: { ORG: user.org, JOB: user.job },
    });
  }
}
