import { IsNotEmpty } from 'class-validator';

export default class IngestDeviceDto {
  @IsNotEmpty({
    message: 'Select an option',
  })
  uploadType: 'url' | 'device';
}
