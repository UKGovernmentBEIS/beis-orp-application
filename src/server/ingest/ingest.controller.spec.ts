import { Test, TestingModule } from '@nestjs/testing';
import { IngestController } from './ingest.controller';
import { HttpModule } from '@nestjs/axios';
import { mockLogger } from '../../../test/mocks/logger.mock';

describe('IngestController', () => {
  let controller: IngestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestController],
      providers: [mockLogger],
      imports: [HttpModule],
    }).compile();

    controller = module.get<IngestController>(IngestController);
  });

  describe('Ingestion', () => {
    it('should redirect to document upload if selected', async () => {
      const expectedResult = await controller.postUploadType({
        uploadType: 'device',
      });

      expect(expectedResult).toEqual({
        url: '/ingest/document',
      });
    });

    it('should redirect to url upload if selected', async () => {
      const expectedResult = await controller.postUploadType({
        uploadType: 'url',
      });

      expect(expectedResult).toEqual({
        url: '/ingest/url',
      });
    });
  });
});
