import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { OrpDal } from '../data/orp.dal';
import { AwsDal } from '../data/aws.dal';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { HttpModule } from '@nestjs/axios';
import { getRawDocument } from '../../../test/mocks/orpSearchMock';
import { RegulatorModule } from '../regulator/regulator.module';
import { DEFAULT_REGULATOR } from '../../../test/mocks/prismaService.mock';
import { RegulatorService } from '../regulator/regulator.service';

describe('DocumentController', () => {
  let controller: DocumentController;
  let documentService: DocumentService;
  let regulatorService: RegulatorService;

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
      imports: [HttpModule, RegulatorModule],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);
    regulatorService = module.get<RegulatorService>(RegulatorService);
  });

  describe('getDocument', () => {
    it('should return information from document service', async () => {
      const orpResponse = {
        document: getRawDocument({ uri: 'thefile.pdf', regulator_id: 'reg' }),
        url: 'http://document',
      };
      jest
        .spyOn(documentService, 'getDocumentDetail')
        .mockResolvedValue(orpResponse);

      const regMock = jest
        .spyOn(regulatorService, 'getRegulatorById')
        .mockResolvedValue(DEFAULT_REGULATOR);

      const result = await controller.getDocument({ id: 'id' });
      expect(regMock).toBeCalledWith('reg');
      expect(result).toEqual({ ...orpResponse, regulator: DEFAULT_REGULATOR });
    });
  });
});
