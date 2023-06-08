import { IsEmail, IsOptional } from 'class-validator';

export class SubscriberDto {
  @IsEmail(
    {},
    { message: 'Enter a valid email address, like name@example.com' },
  )
  emailAddress: string;

  @IsOptional()
  b_421d6e3d31b5a15d8560c613d_d8234fcc62: string;
}
