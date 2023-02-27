import { IsEmail, Matches } from 'class-validator';
import passwordRegex from '../utils/passwordRegex';
import { IsSameAs } from '../../validators/IsSameAs';

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

  @IsSameAs('password', {
    message: 'Your password must match the password entered above',
  })
  confirmPassword: string;
}
