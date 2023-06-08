import { Test, TestingModule } from '@nestjs/testing';
import { UploadedDocumentsService } from './uploaded-documents.service';
import { OrpDal } from '../data/orp.dal';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { HttpModule } from '@nestjs/axios';
import {
  getMappedOrpDocument,
  getRawOrpDocument,
} from '../../../test/mocks/orpSearchMock';
import { RawOrpResponse } from '../data/entities/raw-orp-search-response';
import { DEFAULT_USER_WITH_REGULATOR } from '../../../test/mocks/user.mock';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { OrpSearchMapper } from '../search/utils/orp-search-mapper';
import { RegulatorService } from '../regulator/regulator.service';

const searchPayload = {
  date_published: {
    end_date: undefined,
    start_date: undefined,
  },
  document_type: undefined,
  keyword: undefined,
  regulator_id: [DEFAULT_USER_WITH_REGULATOR.regulator.id],
  regulatory_topic: undefined,
  status: undefined,
  title: undefined,
  page_size: 10,
};

describe('MyDocumentsService', () => {
  let service: UploadedDocumentsService;
  let orpDal: OrpDal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadedDocumentsService,
        OrpDal,
        mockLogger,
        mockConfigService,
        OrpSearchMapper,
        RegulatorService,
      ],
      imports: [HttpModule],
    }).compile();

    service = module.get<UploadedDocumentsService>(UploadedDocumentsService);
    orpDal = module.get<OrpDal>(OrpDal);
  });

  describe('findAll', () => {
    const doc1 = getRawOrpDocument({
      title: 'Title 1',
      date_published: '2018-08-06T00:00:00Z',
    });
    const mapped1 = getMappedOrpDocument({
      title: 'Title 1',
      dates: {
        uploaded: '2019-08-06T00:00:00Z',
        published: '2018-08-06T00:00:00Z',
      },
    });
    const doc2 = getRawOrpDocument({
      title: 'Title 2',
      date_published: '2018-08-07T00:00:00Z',
    });
    const mapped2 = getMappedOrpDocument({
      title: 'Title 2',
      dates: {
        uploaded: '2019-08-06T00:00:00Z',
        published: '2018-08-07T00:00:00Z',
      },
    });

    it('should call search module with regulator id and order by published date', async () => {
      const response: RawOrpResponse = {
        total_search_results: 2,
        documents: [doc1, doc2],
      };
      const searchMock = jest
        .spyOn(orpDal, 'postSearch')
        .mockResolvedValue(response);

      const expectedResult = {
        totalSearchResults: 2,
        documents: [mapped2, mapped1],
      };

      const result = await service.findAll(DEFAULT_USER_WITH_REGULATOR);
      expect(searchMock).toBeCalledWith(searchPayload);
      expect(result).toEqual(expectedResult);
    });
  });
});
