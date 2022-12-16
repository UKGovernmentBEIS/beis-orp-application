import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigService } from '../../../test/mocks/config.mock';
import {
  getPdfAsMulterFile,
  getPdfBuffer,
} from '../../../test/mocks/uploadMocks';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { AwsDal } from './aws.dal';
import { Readable } from 'stream';

const mockS3 = {
  putObject: jest.fn().mockReturnThis(),
  promise: jest.fn(),
  getObject: jest.fn().mockReturnThis(),
  createReadStream: jest.fn(),
};

jest.mock('aws-sdk', () => {
  return { S3: jest.fn(() => mockS3) };
});

jest.mock('uuid', () => {
  return { v4: jest.fn(() => 'UUID') };
});

describe('AwsDal', () => {
  let service: AwsDal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsDal, mockConfigService, mockLogger],
    }).compile();

    service = module.get<AwsDal>(AwsDal);
  });

  describe('upload', () => {
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

  describe('getObject', () => {
    it('should call s3 getObject with correct details and return Readable document', async () => {
      const id = 'bucket/filename.pdf';
      const file = getPdfBuffer();
      mockS3.createReadStream.mockResolvedValueOnce(file);

      const result = await service.getObject(id);

      expect(result).toBeInstanceOf(Buffer);
      expect(mockS3.getObject).toBeCalledWith({
        Bucket: 'bucket',
        Key: id,
      });
    });
  });
});
