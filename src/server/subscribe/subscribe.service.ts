import { Injectable } from '@nestjs/common';
import { SubscriberDto } from './entities/subscriber.dto';
import * as mailchimp from '@mailchimp/mailchimp_marketing';
import { ConfigService } from '@nestjs/config';
import { ApisConfig } from '../config/application-config';
import { MailchimpException } from './entities/types';
import { UserPreferenceDto } from './entities/user-preference.dto';

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
