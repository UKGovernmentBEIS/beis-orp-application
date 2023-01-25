import { IsEmail, IsString } from 'class-validator';

export default class AuthLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
