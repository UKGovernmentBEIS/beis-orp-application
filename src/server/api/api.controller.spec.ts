import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import {
  getPdfAsMulterFile,
  getPdfBuffer,
  mockAwsDal,
} from '../../../test/mocks/uploadMocks';
import { SearchService } from '../search/search.service';
import { TnaDal } from '../data/tna.dal';
import { HttpModule } from '@nestjs/axios';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { OrpDal } from '../data/orp.dal';
import { DocumentService } from '../document/document.service';
import { Readable } from 'stream';
import { StreamableFile } from '@nestjs/common';
import { mockLogger } from '../../../test/mocks/logger.mock';

describe('ApiController', () => {
  let controller: ApiController;
  let documentService: DocumentService;
  let searchService: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        mockAwsDal,
        SearchService,
        TnaDal,
        OrpDal,
        mockConfigService,
        DocumentService,
        mockLogger,
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    documentService = module.get<DocumentService>(DocumentService);
    searchService = module.get<SearchService>(SearchService);
  });

  describe('upload', () => {
    it('should call aws uploader with file', async () => {
      const result = { path: '/file.pdf' };
      jest.spyOn(documentService, 'upload').mockResolvedValue(result);

      const file = await getPdfAsMulterFile();
      const expectedResult = await controller.uploadFile(file);

      expect(expectedResult).toEqual('success');
    });
  });

  describe('search', () => {
    it('should call searchService and return response', async () => {
      const expectedResult = {
        nationalArchive: { totalSearchResults: 10, documents: [] },
        orp: { totalSearchResults: 10, documents: [] },
      };
      jest.spyOn(searchService, 'search').mockResolvedValue(expectedResult);

      const result = await controller.search({
        title: 'title',
        keyword: 'keyword',
      });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getDocument', () => {
    it('should call searchService and return response', async () => {
      const buffer = await getPdfBuffer();
      const getDocMock = jest
        .spyOn(documentService, 'getDocument')
        .mockResolvedValue(Readable.from(buffer));

      const result = await controller.getDocument({ id: 'id' });

      expect(getDocMock).toBeCalledWith('id');
      expect(result).toBeInstanceOf(StreamableFile);
    });
  });
});
