import { IsNotEmpty, Matches } from 'class-validator';
import passwordRegex from '../utils/passwordRegex';
import { IsSameAs } from '../../validators/IsSameAs';

export default class ResetPasswordDto {
  @IsNotEmpty({ message: 'Enter your current password' })
  previousPassword: string;

  @Matches(passwordRegex, {
    message: 'Password must satisfy the criteria displayed',
  })
  newPassword: string;

  @IsSameAs('newPassword', {
    message:
      'Your password confirmation must be the same as the password entered',
  })
  confirmPassword: string;
}
