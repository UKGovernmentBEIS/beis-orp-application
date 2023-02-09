import { IsNotEmpty, IsString } from 'class-validator';

export default class ApiTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  clientSecret: string;

  @IsString()
  @IsNotEmpty()
  clientId: string;
}
