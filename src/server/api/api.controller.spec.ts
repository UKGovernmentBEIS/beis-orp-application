import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { AwsService } from '../aws/aws.service';
import {
  getPdfAsMulterFile,
  mockAwsFileUploader,
} from '../../../test/mocks/uploadMocks';
import { SearchService } from '../search/search.service';
import { TnaDal } from '../search/tna.dal';
import { HttpModule } from '@nestjs/axios';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { OrpDal } from '../search/orp.dal';

describe('ApiController', () => {
  let controller: ApiController;
  let awsService: AwsService;
  let searchService: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        AwsService,
        mockAwsFileUploader,
        SearchService,
        TnaDal,
        OrpDal,
        mockConfigService,
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    awsService = module.get<AwsService>(AwsService);
    searchService = module.get<SearchService>(SearchService);
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

  describe('search', () => {
    it('should call searchService and return response', async () => {
      const result = {
        nationalArchive: { totalSearchResults: 10, documents: [] },
        orp: { totalSearchResults: 10, documents: [] },
      };
      jest.spyOn(searchService, 'search').mockResolvedValue(result);

      const expectedResult = await controller.search({
        title: 'title',
        keywords: 'keyword',
      });

      expect(expectedResult).toEqual(result);
    });
  });
});
