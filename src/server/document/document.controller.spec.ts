import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { OrpDal } from '../data/orp.dal';
import { AwsDal } from '../data/aws.dal';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { HttpModule } from '@nestjs/axios';
import { getRawDocument } from '../../../test/mocks/orpSearchMock';

describe('DocumentController', () => {
  let controller: DocumentController;
  let documentService: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        DocumentService,
        OrpDal,
        AwsDal,
        mockConfigService,
        mockLogger,
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);
  });

  describe('getDocument', () => {
    it('should return information from document service', async () => {
      const expectedResult = {
        document: getRawDocument({ object_key: 'thefile.pdf' }),
        url: 'http://document',
      };
      jest
        .spyOn(documentService, 'getDocumentDetail')
        .mockResolvedValue(expectedResult);

      const result = await controller.getDocument({ id: 'id' });
      expect(result).toEqual(expectedResult);
    });
  });
});
