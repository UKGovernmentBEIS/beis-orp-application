import { Test, TestingModule } from '@nestjs/testing';
import { UploadedDocumentsController } from './uploaded-documents.controller';
import { UploadedDocumentsService } from './uploaded-documents.service';
import { OrpDal } from '../data/orp.dal';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { HttpModule } from '@nestjs/axios';
import { DEFAULT_USER_WITH_REGULATOR } from '../../../test/mocks/user.mock';

describe('UploadedDocumentsController', () => {
  let controller: UploadedDocumentsController;
  let myDocsService: UploadedDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadedDocumentsController],
      providers: [
        UploadedDocumentsService,
        OrpDal,
        mockLogger,
        mockConfigService,
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<UploadedDocumentsController>(
      UploadedDocumentsController,
    );
    myDocsService = module.get<UploadedDocumentsService>(
      UploadedDocumentsService,
    );
  });

  describe('findAll', () => {
    it('should call findAll on uploadedDocumentsService', async () => {
      const expectedResult = {
        totalSearchResults: 10,
        documents: [],
      };

      jest.spyOn(myDocsService, 'findAll').mockResolvedValue(expectedResult);
      const result = await controller.findAll(DEFAULT_USER_WITH_REGULATOR);
      expect(result).toEqual(expectedResult);
    });
  });
});
