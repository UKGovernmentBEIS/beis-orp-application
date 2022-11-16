import { IsEmail, IsNotEmpty } from 'class-validator';

export class SubscriberDto {
  @IsEmail()
  email_address: string;

  @IsNotEmpty()
  org: string;

  @IsNotEmpty()
  job: string;
}
