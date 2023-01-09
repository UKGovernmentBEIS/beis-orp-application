import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TnaDal } from '../data/tna.dal';
import { OrpDal } from '../data/orp.dal';
import { HttpModule } from '@nestjs/axios';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { mockLogger } from '../../../test/mocks/logger.mock';

describe('SearchController', () => {
  let controller: SearchController;
  let searchService: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [SearchService, TnaDal, OrpDal, mockConfigService, mockLogger],
      imports: [HttpModule],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    searchService = module.get<SearchService>(SearchService);
  });

  describe('search', () => {
    it('should be call search if title query is present', async () => {
      const expectedResult = {
        nationalArchive: { totalSearchResults: 10, documents: [] },
        orp: { totalSearchResults: 10, documents: [] },
      };
      jest.spyOn(searchService, 'search').mockResolvedValue(expectedResult);
      const result = await controller.search({ title: 'Title' });
      expect(result).toEqual({
        title: 'Title',
        keyword: undefined,
        results: expectedResult,
      });
    });

    it('should be call search if keyword query is present', async () => {
      const expectedResult = {
        nationalArchive: { totalSearchResults: 10, documents: [] },
        orp: { totalSearchResults: 10, documents: [] },
      };
      jest.spyOn(searchService, 'search').mockResolvedValue(expectedResult);
      const result = await controller.search({ keyword: 'Keyword' });
      expect(result).toEqual({
        title: undefined,
        keyword: 'Keyword',
        results: expectedResult,
      });
    });

    it('should be call search if both title and keyword queries are present', async () => {
      const expectedResult = {
        nationalArchive: { totalSearchResults: 10, documents: [] },
        orp: { totalSearchResults: 10, documents: [] },
      };
      jest.spyOn(searchService, 'search').mockResolvedValue(expectedResult);
      const result = await controller.search({
        keyword: 'Keyword',
        title: 'Title',
      });
      expect(result).toEqual({
        title: 'Title',
        keyword: 'Keyword',
        results: expectedResult,
      });
    });

    it('should not call search if neither title or keyword queries are present', async () => {
      const expectedResult = {
        nationalArchive: { totalSearchResults: 10, documents: [] },
        orp: { totalSearchResults: 10, documents: [] },
      };
      jest.spyOn(searchService, 'search').mockResolvedValue(expectedResult);
      const result = await controller.search({});
      expect(result).toEqual({
        title: undefined,
        keyword: undefined,
        results: null,
      });
    });
  });
});
