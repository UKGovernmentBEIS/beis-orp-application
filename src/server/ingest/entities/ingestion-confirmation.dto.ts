import { IsNotEmpty, IsString } from 'class-validator';

export default class IngestionConfirmationDto {
  @IsNotEmpty({
    message:
      'Select yes if you want to upload this file, or no if you want to select a different file',
  })
  @IsString()
  confirm: 'yes' | 'no';

  @IsString()
  key: string;
}
