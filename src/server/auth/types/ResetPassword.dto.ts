import { IsNotEmpty, Matches } from 'class-validator';
import passwordRegex from '../utils/passwordRegex';
import { IsSameAs } from '../../validators/IsSameAs';

export default class ResetPasswordDto {
  @IsNotEmpty({ message: 'Enter your current password' })
  previousPassword: string;

  @Matches(passwordRegex, {
    message: 'Password must satisfy the criteria above',
  })
  newPassword: string;

  @IsSameAs('newPassword', {
    message: 'Your password must match the password entered above',
  })
  confirmPassword: string;
}
