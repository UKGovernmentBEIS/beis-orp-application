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
    HeadObjectCommand: jest.fn((args) => ({
      ...args,
      headObjectCommand: true,
    })),
    CopyObjectCommand: jest.fn((args) => ({
      ...args,
      copyObjectCommand: true,
    })),
    DeleteObjectCommand: jest.fn((args) => ({
      ...args,
      deleteObjectCommand: true,
    })),
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
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should call s3 putObject with correct details with lowercase key', async () => {
      const date = new Date('2020-01-01');
      jest.useFakeTimers().setSystemTime(date);

      mockS3.send.mockResolvedValueOnce('fake response');
      const file = await getPdfAsMulterFile();

      const result = await service.upload(file, 'cogun', 'regid', {
        status: 'published',
      });

      expect(result).toEqual({
        key: 'uuid-original-filename',
        id: 'UUID',
      });
      expect(mockS3.send).toBeCalledWith({
        putObjectCommand: true,
        Bucket: 'bucket',
        Key: 'uuid-original-filename',
        ContentType: file.mimetype,
        Body: file.buffer,
        Metadata: {
          uuid: 'UUID',
          uploaded_date: date.toTimeString(),
          file_name: 'Original-Filename',
          regulator_id: 'regid',
          user_id: 'cogun',
          status: 'published',
          document_format: file.mimetype,
        },
        ACL: 'authenticated-read',
      });

      jest.useRealTimers();
    });

    it('should prepend unconfirmed/ if true', async () => {
      const date = new Date('2020-01-01');
      jest.useFakeTimers().setSystemTime(date);

      mockS3.send.mockResolvedValueOnce('fake response');
      const file = await getPdfAsMulterFile();

      const result = await service.upload(file, 'cogun', 'regid', {}, true);

      expect(result).toEqual({
        key: 'unconfirmed/uuid-original-filename',
        id: 'UUID',
      });
      expect(mockS3.send).toBeCalledWith({
        putObjectCommand: true,
        Bucket: 'bucket',
        Key: 'unconfirmed/uuid-original-filename',
        ContentType: file.mimetype,
        Body: file.buffer,
        Metadata: {
          uuid: 'UUID',
          uploaded_date: date.toTimeString(),
          file_name: 'Original-Filename',
          regulator_id: 'regid',
          user_id: 'cogun',
          document_format: file.mimetype,
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

  describe('getObjectMeta', () => {
    it('should request meta data of object', async () => {
      const key = 'key';
      const meta = { this: 'that' };
      mockS3.send.mockResolvedValueOnce({ Metadata: meta });

      const result = await service.getObjectMeta(key);

      expect(result).toEqual(meta);
      expect(mockS3.send).toBeCalledWith({
        headObjectCommand: true,
        Bucket: 'bucket',
        Key: key,
      });
    });
  });

  describe('copyObject', () => {
    it('should copy object to the second key passed in', async () => {
      const resp = { this: 'that' };
      mockS3.send.mockResolvedValueOnce(resp);

      const result = await service.copyObject('oldKey', 'newKey');

      expect(result).toEqual({ from: 'oldKey', to: 'newKey' });
      expect(mockS3.send).toBeCalledWith({
        copyObjectCommand: true,
        Bucket: 'bucket',
        CopySource: 'bucket/oldKey',
        Key: 'newKey',
      });
    });
  });

  describe('deleteObject', () => {
    it('should delete object passed in', async () => {
      const resp = { this: 'that' };
      mockS3.send.mockResolvedValueOnce(resp);

      const result = await service.deleteObject('key');

      expect(result).toEqual({ deleted: 'key' });
      expect(mockS3.send).toBeCalledWith({
        deleteObjectCommand: true,
        Bucket: 'bucket',
        Key: 'key',
      });
    });
  });

  describe('updateMetaData', () => {
    it('should get the meta and copy the object with new meta', async () => {
      const resp = { Metadata: { old: 'meta' } };
      mockS3.send.mockResolvedValueOnce(resp);

      await service.updateMetaData('key', { new: 'meta' });

      expect(mockS3.send).toBeCalledTimes(2);
      expect(mockS3.send).toBeCalledWith({
        copyObjectCommand: true,
        Bucket: 'bucket',
        CopySource: 'bucket/key',
        Key: 'key',
        MetadataDirective: 'REPLACE',
        Metadata: {
          old: 'meta',
          new: 'meta',
        },
      });
    });
  });
});
