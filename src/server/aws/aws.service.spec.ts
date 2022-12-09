import { Test, TestingModule } from '@nestjs/testing';
import { AwsService } from './aws.service';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { AwsFileUploader } from './aws-file-uploader';
import { getPdfAsMulterFile } from '../../../test/mocks/uploadMocks';
import { mockLogger } from '../../../test/mocks/logger.mock';

const mockS3 = {
  putObject: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => {
  return { S3: jest.fn(() => mockS3) };
});

jest.mock('uuid', () => {
  return { v4: jest.fn(() => 'UUID') };
});

describe('AwsService', () => {
  let service: AwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsService, AwsFileUploader, mockConfigService, mockLogger],
    }).compile();

    service = module.get<AwsService>(AwsService);
  });

  it('should call s3 putObject with correct details', async () => {
    const date = new Date('2020-01-01');
    jest.useFakeTimers().setSystemTime(date);

    mockS3.promise.mockResolvedValueOnce('fake response');
    const file = await getPdfAsMulterFile();

    const result = await service.upload(file);

    expect(result.path).toContain('bucket/UUID-original-filename');
    expect(mockS3.putObject).toBeCalledWith({
      Bucket: 'bucket',
      Key: 'UUID-original-filename',
      ContentType: file.mimetype,
      Body: file.buffer,
      Metadata: {
        uuid: 'UUID',
        uploadedDate: date.toTimeString(),
      },
      ACL: 'authenticated-read',
    });

    jest.useRealTimers();
  });
});
