import { IsEmail, IsString } from 'class-validator';

export default class AuthRegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
