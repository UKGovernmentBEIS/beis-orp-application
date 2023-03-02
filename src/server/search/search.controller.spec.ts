import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TnaDal } from '../data/tna.dal';
import { OrpDal } from '../data/orp.dal';
import { HttpModule } from '@nestjs/axios';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { RegulatorService } from '../regulator/regulator.service';
import { Regulator } from '@prisma/client';
import { documentTypes } from './types/documentTypes';
import { documentStatus } from './types/statusTypes';
import * as mocks from 'node-mocks-http';

const MOCK_REGULATORS: Regulator[] = [
  { id: 'id', name: 'reg', domain: 'reg@reg.com' },
];

const FILTERS = {
  regulators: MOCK_REGULATORS,
  docTypes: documentTypes,
  statuses: documentStatus,
};

const req = mocks.createRequest({
  session: {},
});
describe('SearchController', () => {
  let controller: SearchController;
  let searchService: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        SearchService,
        TnaDal,
        OrpDal,
        mockConfigService,
        mockLogger,
        RegulatorService,
      ],
      imports: [HttpModule],
    })
      .overrideProvider(RegulatorService)
      .useValue({
        getRegulators: () => MOCK_REGULATORS,
      })
      .compile();

    controller = module.get<SearchController>(SearchController);
    searchService = module.get<SearchService>(SearchService);
  });

  describe('search', () => {
    it('should call search if title query is present', async () => {
      const expectedResult = {
        legislation: { totalSearchResults: 10, documents: [] },
        regulatoryMaterial: { totalSearchResults: 10, documents: [] },
      };

      jest.spyOn(searchService, 'search').mockResolvedValue(expectedResult);
      const result = await controller.search(req, { title: 'Title' });
      expect(result).toEqual({
        searchedValues: { title: 'Title', keyword: undefined },
        filters: FILTERS,
        results: expectedResult,
      });
    });

    it('should be call search if keyword query is present', async () => {
      const expectedResult = {
        legislation: { totalSearchResults: 10, documents: [] },
        regulatoryMaterial: { totalSearchResults: 10, documents: [] },
      };
      jest.spyOn(searchService, 'search').mockResolvedValue(expectedResult);
      const result = await controller.search(req, { keyword: 'Keyword' });
      expect(result).toEqual({
        searchedValues: { title: undefined, keyword: 'Keyword' },
        filters: FILTERS,
        results: expectedResult,
      });
    });

    it('should be call search if both title and keyword queries are present', async () => {
      const expectedResult = {
        legislation: { totalSearchResults: 10, documents: [] },
        regulatoryMaterial: { totalSearchResults: 10, documents: [] },
      };
      jest.spyOn(searchService, 'search').mockResolvedValue(expectedResult);
      const result = await controller.search(req, {
        keyword: 'Keyword',
        title: 'Title',
      });
      expect(result).toEqual({
        searchedValues: { title: 'Title', keyword: 'Keyword' },
        filters: FILTERS,
        results: expectedResult,
      });
    });

    it('should not call search if neither title or keyword queries are present', async () => {
      const expectedResult = {
        legislation: { totalSearchResults: 10, documents: [] },
        regulatoryMaterial: { totalSearchResults: 10, documents: [] },
      };
      jest.spyOn(searchService, 'search').mockResolvedValue(expectedResult);
      const result = await controller.search(req, {});
      expect(result).toEqual({
        searchedValues: { title: undefined, keyword: undefined },
        filters: FILTERS,
        results: null,
      });
    });
  });
});
