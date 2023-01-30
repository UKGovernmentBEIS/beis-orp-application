import { IsEmail, Matches } from 'class-validator';
import passwordRegex from '../utils/passwordRegex';

export default class AuthRegisterDto {
  @IsEmail(
    {},
    {
      message:
        'Enter your email in the correct format, such as name@example.com',
    },
  )
  email: string;

  @Matches(passwordRegex, {
    message: 'Password must satisfy the criteria above',
  })
  password: string;
}
