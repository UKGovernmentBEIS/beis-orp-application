import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { TnaDal } from '../data/tna.dal';
import { HttpModule } from '@nestjs/axios';
import { OrpDal } from '../data/orp.dal';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { mockLogger } from '../../../test/mocks/logger.mock';

describe('SearchService', () => {
  let service: SearchService;
  let tnaDal: TnaDal;
  let orpDal: OrpDal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService, TnaDal, OrpDal, mockConfigService, mockLogger],
      imports: [HttpModule],
    }).compile();

    service = module.get<SearchService>(SearchService);
    tnaDal = module.get<TnaDal>(TnaDal);
    orpDal = module.get<OrpDal>(OrpDal);
  });

  describe('search', () => {
    it('should search the national archives and orp', async () => {
      const tnaResponse = { totalSearchResults: 10, documents: [] };
      const orpResponse = { totalSearchResults: 5, documents: [] };
      jest.spyOn(tnaDal, 'searchTna').mockResolvedValue(tnaResponse);
      jest.spyOn(orpDal, 'searchOrp').mockResolvedValue(orpResponse);

      expect(await service.search({ title: 'a', keyword: 'b' })).toStrictEqual({
        nationalArchive: tnaResponse,
        orp: orpResponse,
      });
    });
  });

  describe('searchForView', () => {
    it('should search the national archives and orp and map to view object', async () => {
      const tnaResponse = {
        totalSearchResults: 10,
        documents: [
          {
            legislationType: 'EuropeanUnionRegulation',
            links: [
              {
                href: 'http://www.legislation.gov.uk/id/eur/2019/1397',
                rel: 'self',
              },
              {
                href: 'http://www.legislation.gov.uk/eur/2019/1397/2020-08-31',
              },
              {
                href: 'http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.xml',
                title: 'XML',
                type: 'application/xml',
                rel: 'alternate',
              },
            ],
            dates: {
              published: '2019-08-06T00:00:00Z',
              updated: '2020-12-12T23:12:15Z',
            },
            number: 1397,
            year: 2019,
            title:
              'Commission Implementing Regulation (EU) 2019/1397 of 6 August 2019 on design, construction and performance requirements and testing standards for marine equipment and repealing Implementing Regulation (EU) 2018/773 (Text with EEA relevance) (repealed)',
          },
        ],
      };
      const orpResponse = { totalSearchResults: 5, documents: [] };
      jest.spyOn(tnaDal, 'searchTna').mockResolvedValue(tnaResponse);
      jest.spyOn(orpDal, 'searchOrp').mockResolvedValue(orpResponse);

      expect(
        await service.searchForView({ title: 'a', keyword: 'b' }),
      ).toStrictEqual({
        nationalArchive: {
          ...tnaResponse,
          documents: [
            {
              ...tnaResponse.documents[0],
              href: 'http://www.legislation.gov.uk/eur/2019/1397/2020-08-31',
            },
          ],
        },
        orp: orpResponse,
      });
    });
  });
});
