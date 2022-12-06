import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { TnaDal } from './tna.dal';
import { HttpModule } from '@nestjs/axios';

describe('SearchService', () => {
  let service: SearchService;
  let tnaDal: TnaDal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService, TnaDal],
      imports: [HttpModule],
    }).compile();

    service = module.get<SearchService>(SearchService);
    tnaDal = module.get<TnaDal>(TnaDal);
  });

  it('should search the national archives', async () => {
    const response = {
      totalItems: 10,
      items: [],
    };
    jest.spyOn(tnaDal, 'searchTna').mockResolvedValue(response);

    expect(await service.search('a', 'b')).toStrictEqual({
      nationalArchive: response,
    });
  });
});
