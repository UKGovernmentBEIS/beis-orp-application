import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { OrpDal } from '../data/orp.dal';
import { AwsDal } from '../data/aws.dal';
import { HttpModule } from '@nestjs/axios';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { Logger } from '@nestjs/common';
import { getRawDocument } from '../../../test/mocks/orpSearchMock';
import { getPdfBuffer } from '../../../test/mocks/uploadMocks';
import { Readable } from 'stream';

describe('DocumentService', () => {
  let service: DocumentService;
  let orpDal: OrpDal;
  let awsDal: AwsDal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [DocumentService, OrpDal, AwsDal, mockConfigService, Logger],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    orpDal = module.get<OrpDal>(OrpDal);
    awsDal = module.get<AwsDal>(AwsDal);
  });

  describe('getDocument', () => {
    it('get uri using orp search and get document form s3', async () => {
      const buffer = await getPdfBuffer();

      jest
        .spyOn(orpDal, 'getById')
        .mockResolvedValue(getRawDocument({ object_key: 'thefile.pdf' }));

      const getObjSpy = jest
        .spyOn(awsDal, 'getObject')
        .mockResolvedValueOnce(Readable.from(buffer));

      const result = await service.getDocument('id');

      expect(getObjSpy).toBeCalledWith('thefile.pdf');
      expect(result).toBeInstanceOf(Readable);
    });
  });

  describe('getDocumentDetail', () => {
    it('should return the document search data and a presigned url', async () => {
      jest
        .spyOn(orpDal, 'getById')
        .mockResolvedValue(getRawDocument({ object_key: 'thefile.pdf' }));

      const getUrlSpy = jest
        .spyOn(awsDal, 'getObjectUrl')
        .mockResolvedValueOnce('http://document');

      const result = await service.getDocumentDetail('id');

      expect(getUrlSpy).toBeCalledWith('thefile.pdf');

      expect(result).toMatchObject({
        url: 'http://document',
        document: {
          title: 'Title',
          object_key: 'thefile.pdf',
        },
      });
    });
  });
});
