import { MemberErrorResponse } from '@mailchimp/mailchimp_marketing';

export class MailchimpException extends Error {
  constructor(public errorObj: MemberErrorResponse) {
    super('Mailchimp error');
  }

  isEmailInUse() {
    return this.errorObj.title === 'Member Exists';
  }
}
