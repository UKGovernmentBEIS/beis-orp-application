import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { OrpDal } from '../data/orp.dal';
import { AwsDal } from '../data/aws.dal';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { HttpModule } from '@nestjs/axios';
import {
  getMappedOrpDocument,
  getRawOrpDocument,
} from '../../../test/mocks/orpSearchMock';
import { RegulatorModule } from '../regulator/regulator.module';
import { DEFAULT_REGULATOR } from '../../../test/mocks/user.mock';
import { RegulatorService } from '../regulator/regulator.service';
import { SearchService } from '../search/search.service';
import { TnaDal } from '../data/tna.dal';
import TnaDocMeta from './types/TnaDocMeta';

describe('DocumentController', () => {
  let controller: DocumentController;
  let documentService: DocumentService;
  let regulatorService: RegulatorService;
  let searchService: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        DocumentService,
        OrpDal,
        AwsDal,
        mockConfigService,
        mockLogger,
        SearchService,
        TnaDal,
      ],
      imports: [HttpModule, RegulatorModule],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);
    regulatorService = module.get<RegulatorService>(RegulatorService);
    searchService = module.get<SearchService>(SearchService);
  });

  describe('getDocument', () => {
    it('should return information from document service', async () => {
      const orpResponse = {
        document: getRawOrpDocument({
          uri: 'thefile.pdf',
          regulator_id: 'reg',
          document_type: 'GD',
        }),
        url: 'http://document',
      };
      jest
        .spyOn(documentService, 'getDocumentDetail')
        .mockResolvedValue(orpResponse);

      const regMock = jest
        .spyOn(regulatorService, 'getRegulatorById')
        .mockReturnValue(DEFAULT_REGULATOR);

      const result = await controller.getDocument({ id: 'id' });
      expect(regMock).toBeCalledWith('reg');
      expect(result).toEqual({
        ...orpResponse,
        regulator: DEFAULT_REGULATOR,
        docType: 'Guidance',
      });
    });
  });

  describe('getLinkedDocuments', () => {
    it('should return tna doc data with the linked documents from orp', async () => {
      const tnaDoc: TnaDocMeta = {
        title: 'Title',
        docType: 'Primary',
        year: '2020',
        number: '4',
      };
      const relatedDocs = [getMappedOrpDocument()];

      jest.spyOn(documentService, 'getTnaDocument').mockResolvedValue({
        title: 'Title',
        docType: 'Primary',
        year: '2020',
        number: '4',
      });
      jest.spyOn(searchService, 'getLinkedDocuments').mockResolvedValue({
        documents: [
          {
            legislationHref: 'href',
            relatedDocuments: relatedDocs,
          },
        ],
        totalSearchResults: 1,
      });

      const result = await controller.getLinkedDocuments({ id: 'id' });
      expect(result).toEqual({
        href: 'id',
        documentData: tnaDoc,
        linkedDocuments: relatedDocs,
      });
    });
  });
});
