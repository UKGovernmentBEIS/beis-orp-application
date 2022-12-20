import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { TnaDal } from '../data/tna.dal';
import { HttpModule } from '@nestjs/axios';
import { OrpDal } from '../data/orp.dal';
import { mockConfigService } from '../../../test/mocks/config.mock';

describe('SearchService', () => {
  let service: SearchService;
  let tnaDal: TnaDal;
  let orpDal: OrpDal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService, TnaDal, OrpDal, mockConfigService],
      imports: [HttpModule],
    }).compile();

    service = module.get<SearchService>(SearchService);
    tnaDal = module.get<TnaDal>(TnaDal);
    orpDal = module.get<OrpDal>(OrpDal);
  });

  it('should search the national archives and orp', async () => {
    const tnaResponse = { totalSearchResults: 10, documents: [] };
    const orpResponse = { totalSearchResults: 5, documents: [] };
    jest.spyOn(tnaDal, 'searchTna').mockResolvedValue(tnaResponse);
    jest.spyOn(orpDal, 'searchOrp').mockResolvedValue(orpResponse);

    expect(await service.search('a', 'b')).toStrictEqual({
      nationalArchive: tnaResponse,
      orp: orpResponse,
    });
  });
});
