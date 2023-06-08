import { IsNotEmpty, IsString } from 'class-validator';

export default class ApiTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  client_secret: string;

  @IsString()
  @IsNotEmpty()
  client_id: string;
}
