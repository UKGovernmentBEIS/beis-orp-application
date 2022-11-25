import { IsEmail, IsIn } from 'class-validator';

export class UserPreferenceDto {
  @IsEmail()
  emailAddress: string;

  @IsIn(['subscribed', 'unsubscribed'])
  subscription: 'subscribed' | 'unsubscribed';
}
