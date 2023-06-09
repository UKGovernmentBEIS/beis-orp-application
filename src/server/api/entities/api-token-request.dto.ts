import { IsIn, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export default class ApiTokenRequestDto {
  @IsNotEmpty()
  @IsIn(['client_credentials', 'refresh_token'])
  grant_type: 'client_credentials' | 'refresh_token';

  @ValidateIf((o) => o.grant_type === 'refresh_token')
  @IsString()
  @IsNotEmpty()
  refresh_token?: string;

  @ValidateIf((o) => o.grant_type === 'client_credentials')
  @IsString()
  @IsNotEmpty()
  client_secret?: string;

  @ValidateIf((o) => o.grant_type === 'client_credentials')
  @IsString()
  @IsNotEmpty()
  client_id?: string;
}
