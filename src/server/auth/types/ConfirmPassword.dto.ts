import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import passwordRegex from '../utils/passwordRegex';
import { IsSameAs } from '../../validators/IsSameAs';

export default class ConfirmPasswordDto {
  @IsString({ message: 'Enter the code that was sent to your email address' })
  @IsNotEmpty({ message: 'Enter the code that was sent to your email address' })
  verificationCode: string;

  @IsEmail({ message: 'Enter your email address' })
  email: string;

  @Matches(passwordRegex, {
    message: 'Password must satisfy the criteria above',
  })
  newPassword: string;

  @IsSameAs('newPassword', {
    message: 'Your password must match the password entered above',
  })
  confirmPassword: string;
}
