import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { OrpDal } from '../data/orp.dal';
import { AwsDal } from '../data/aws.dal';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { HttpModule } from '@nestjs/axios';
import { getMappedOrpDocument } from '../../../test/mocks/orpSearchMock';
import { SearchService } from '../search/search.service';
import { TnaDal } from '../data/tna.dal';
import TnaDocMeta from './entities/tna-doc-meta';
import { RegulatorService } from '../regulator/regulator.service';
import { OrpSearchMapper } from '../search/utils/orp-search-mapper';

describe('DocumentController', () => {
  let controller: DocumentController;
  let documentService: DocumentService;
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
        RegulatorService,
        OrpSearchMapper,
        RegulatorService,
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);
    searchService = module.get<SearchService>(SearchService);
  });

  describe('getDocument', () => {
    it('should return information from document service', async () => {
      const document = getMappedOrpDocument({
        creator: 'Water Services Regulation Authority',
        documentType: 'GD',
      });
      const urlResponse = {
        url: 'http://document',
        documentFormat: 'application/pdf',
      };
      jest
        .spyOn(documentService, 'getDocumentById')
        .mockResolvedValue(document);
      jest
        .spyOn(documentService, 'getDocumentUrl')
        .mockResolvedValue(urlResponse);

      const result = await controller.getDocument({ id: 'id' }, {});
      expect(result).toEqual({
        document,
        ...urlResponse,
        regulator: {
          domain: 'ofwat.gov.uk',
          id: 'ofwat',
          name: 'Water Services Regulation Authority',
        },
        docType: 'Guidance',
        ingested: false,
        title: 'Document details for Title',
      });
    });

    it('should return ingested as true of in query params', async () => {
      const document = getMappedOrpDocument();
      const urlResponse = {
        url: 'http://document',
        documentFormat: 'application/pdf',
      };
      jest
        .spyOn(documentService, 'getDocumentById')
        .mockResolvedValue(document);
      jest
        .spyOn(documentService, 'getDocumentUrl')
        .mockResolvedValue(urlResponse);

      const result = await controller.getDocument(
        { id: 'id' },
        { ingested: 'true' },
      );
      expect(result).toMatchObject({
        ingested: true,
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

      const result = await controller.getLinkedDocuments({
        id: 'id',
        published: '2022-01-01',
      });
      expect(result).toEqual({
        href: 'id',
        documentData: tnaDoc,
        linkedDocuments: relatedDocs,
        publishedDate: '2022-01-01',
      });
    });
  });
});
