import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { TnaDal } from '../data/tna.dal';
import { HttpModule } from '@nestjs/axios';
import { OrpDal } from '../data/orp.dal';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { mockRegulatorService } from '../../../test/mocks/regulatorService.mock';
import {
  expectedInternalOutputForOrpStandardResponse,
  orpStandardResponse,
} from '../../../test/mocks/orpSearchMock';
import {
  expectedInternalOutputForLinkedDocs,
  linkedDocsRawResponse,
} from '../../../test/mocks/linkedDocumentsMock';
import { RawOrpResponse } from '../data/entities/raw-orp-search-response';
import { RawTnaResponse } from '../data/entities/raw-tna-search-response';
import {
  expectedInternalOutputForTnaStandardResponse,
  tnaStandardResponseJson,
} from '../../../test/mocks/tnaSearchMock';

describe('SearchService', () => {
  let service: SearchService;
  let tnaDal: TnaDal;
  let orpDal: OrpDal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        TnaDal,
        OrpDal,
        mockConfigService,
        mockLogger,
        mockRegulatorService,
      ],
      imports: [HttpModule],
    }).compile();

    service = module.get<SearchService>(SearchService);
    tnaDal = module.get<TnaDal>(TnaDal);
    orpDal = module.get<OrpDal>(OrpDal);
  });

  describe('search', () => {
    it('should search the national archives and orp', async () => {
      const tnaResponse: RawTnaResponse = {
        feed: { entry: [], 'openSearch:totalResults': { _text: '0' } },
      };
      const orpResponse = { total_search_results: 5, documents: [] };
      jest.spyOn(tnaDal, 'searchTna').mockResolvedValue(tnaResponse);
      jest.spyOn(orpDal, 'searchOrp').mockResolvedValue(orpResponse);

      expect(await service.search({ title: 'a', keyword: 'b' })).toStrictEqual({
        legislation: { totalSearchResults: 0, documents: [] },
        regulatoryMaterial: { totalSearchResults: 5, documents: [] },
      });
    });

    it('should map the response from orp', async () => {
      const tnaResponse: RawTnaResponse = {
        feed: { entry: [], 'openSearch:totalResults': { _text: '0' } },
      };
      jest.spyOn(tnaDal, 'searchTna').mockResolvedValue(tnaResponse);
      jest.spyOn(orpDal, 'searchOrp').mockResolvedValue(orpStandardResponse);

      expect(await service.search({ title: 'a', keyword: 'b' })).toStrictEqual({
        legislation: { totalSearchResults: 0, documents: [] },
        regulatoryMaterial: expectedInternalOutputForOrpStandardResponse,
      });
    });

    it('should map TNA response', async () => {
      const orpResponse = { total_search_results: 5, documents: [] };
      jest
        .spyOn(tnaDal, 'searchTna')
        .mockResolvedValue(tnaStandardResponseJson);
      jest.spyOn(orpDal, 'searchOrp').mockResolvedValue(orpResponse);

      expect(await service.search({ title: 'a', keyword: 'b' })).toEqual({
        legislation: expectedInternalOutputForTnaStandardResponse,
        regulatoryMaterial: { totalSearchResults: 5, documents: [] },
      });
    });
  });

  describe('getLinkedDocuments', () => {
    it('should search the orp and map response', async () => {
      // casting as jest is confused by overloaded function
      jest
        .spyOn(orpDal, 'postSearch')
        .mockResolvedValue(linkedDocsRawResponse as unknown as RawOrpResponse);

      expect(
        await service.getLinkedDocuments({ legislation_href: ['href'] }),
      ).toEqual(expectedInternalOutputForLinkedDocs);
    });
  });
});
