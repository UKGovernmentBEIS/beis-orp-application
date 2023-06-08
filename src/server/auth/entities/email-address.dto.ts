import { IsEmail } from 'class-validator';

export default class EmailAddressDto {
  @IsEmail(
    {},
    {
      message:
        'Enter your email in the correct format, such as name@example.com',
    },
  )
  email: string;
}
