import { IsNotEmpty, IsString } from 'class-validator';

export default class ApiRefreshTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
