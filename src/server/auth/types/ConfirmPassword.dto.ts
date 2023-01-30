import { IsNotEmpty, IsString, Matches } from 'class-validator';
import passwordRegex from '../utils/passwordRegex';

export default class ConfirmPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Enter the code that was sent to your email address' })
  verificationCode: string;

  @Matches(passwordRegex, {
    message: 'Password must satisfy the criteria above',
  })
  newPassword: string;
}
