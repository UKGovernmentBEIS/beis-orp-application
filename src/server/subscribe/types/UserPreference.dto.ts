import { IsEmail, IsIn } from 'class-validator';

export class UserPreferenceDto {
  @IsEmail({}, { message: 'Enter a valid email address' })
  emailAddress: string;

  @IsIn(['subscribed', 'unsubscribed'], { message: 'Select an option' })
  subscription: 'subscribed' | 'unsubscribed';
}
