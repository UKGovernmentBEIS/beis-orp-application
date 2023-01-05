import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigService } from '../../../test/mocks/config.mock';
import {
  getPdfAsMulterFile,
  getPdfBuffer,
} from '../../../test/mocks/uploadMocks';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { AwsDal } from './aws.dal';

const mockS3 = {
  send: jest.fn(),
};

const mockUrl = 'http://document';

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn(() => mockS3),
    PutObjectCommand: jest.fn((args) => ({ ...args, putObjectCommand: true })),
    GetObjectCommand: jest.fn((args) => ({ ...args, getObjectCommand: true })),
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: () => mockUrl,
  };
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
    it('should call s3 putObject with correct details with lowercase key', async () => {
      const date = new Date('2020-01-01');
      jest.useFakeTimers().setSystemTime(date);

      mockS3.send.mockResolvedValueOnce('fake response');
      const file = await getPdfAsMulterFile();

      const result = await service.upload(file);

      expect(result.path).toContain('bucket/uuid-original-filename');
      expect(mockS3.send).toBeCalledWith({
        putObjectCommand: true,
        Bucket: 'bucket',
        Key: 'uuid-original-filename',
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
      mockS3.send.mockResolvedValueOnce({ Body: file });

      const result = await service.getObject(id);

      expect(result).toBeInstanceOf(Buffer);
      expect(mockS3.send).toBeCalledWith({
        getObjectCommand: true,
        Bucket: 'bucket',
        Key: id,
      });
    });
  });

  describe('getObjectUrl', () => {
    it('should get a presigned url for the s3 object', async () => {
      const id = 'bucket/filename.pdf';
      const result = await service.getObjectUrl(id);

      expect(result).toEqual(mockUrl);
    });
  });
});
