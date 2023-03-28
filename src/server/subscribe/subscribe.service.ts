import { Injectable } from '@nestjs/common';
import { SubscriberDto } from './types/Subscriber.dto';
import * as mailchimp from '@mailchimp/mailchimp_marketing';
import { ConfigService } from '@nestjs/config';
import { ApisConfig } from '../config/application-config';
import { MailchimpException } from './types/types';
import { UserPreferenceDto } from './types/UserPreference.dto';

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

  async subscribeUser(user: SubscriberDto) {
    try {
      return await mailchimp.lists.addListMember(this.mcConfig.list, {
        email_address: user.emailAddress,
        status: 'subscribed',
      });
    } catch (e: any) {
      throw new MailchimpException(e.response.body);
    }
  }

  updatePreference(userPreferenceDto: UserPreferenceDto) {
    return mailchimp.lists.updateListMember(
      this.mcConfig.list,
      userPreferenceDto.emailAddress,
      { status: userPreferenceDto.subscription },
    );
  }
}
