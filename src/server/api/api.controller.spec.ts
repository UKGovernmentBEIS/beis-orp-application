import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { AwsService } from '../aws/aws.service';
import {
  getPdfAsMulterFile,
  mockAwsFileUploader,
} from '../../../test/api/mocks/uploadMocks';

describe('ApiController', () => {
  let controller: ApiController;
  let awsService: AwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [AwsService, mockAwsFileUploader],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    awsService = module.get<AwsService>(AwsService);
  });

  describe('upload', () => {
    it('should call aws uploader with file', async () => {
      const result = { path: '/file.pdf' };
      jest.spyOn(awsService, 'upload').mockResolvedValue(result);

      const file = await getPdfAsMulterFile();
      const expectedResult = await controller.uploadFile(file);

      expect(expectedResult).toEqual('success');
    });
  });
});
