import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { OrpDal } from '../data/orp.dal';
import { AwsDal } from '../data/aws.dal';
import { HttpModule } from '@nestjs/axios';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { Logger } from '@nestjs/common';
import { getRawOrpDocument } from '../../../test/mocks/orpSearchMock';
import { getPdfBuffer } from '../../../test/mocks/uploadMocks';
import { Readable } from 'stream';
import { TnaDal } from '../data/tna.dal';
import {
  tnaEuDocumentMockJson,
  tnaUkDocumentMockJson,
} from '../../../test/mocks/tnaDocumentsMock';
import { TnaEuDoc } from '../data/types/tnaDocs';

describe('DocumentService', () => {
  let service: DocumentService;
  let orpDal: OrpDal;
  let awsDal: AwsDal;
  let tnaDal: TnaDal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        DocumentService,
        OrpDal,
        AwsDal,
        mockConfigService,
        Logger,
        TnaDal,
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    orpDal = module.get<OrpDal>(OrpDal);
    awsDal = module.get<AwsDal>(AwsDal);
    tnaDal = module.get<TnaDal>(TnaDal);
  });

  describe('getDocument', () => {
    it('get uri using orp search and get document form s3', async () => {
      const buffer = await getPdfBuffer();

      jest
        .spyOn(orpDal, 'getById')
        .mockResolvedValue(getRawOrpDocument({ uri: 'thefile.pdf' }));

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
        .mockResolvedValue(getRawOrpDocument({ uri: 'thefile.pdf' }));

      const getUrlSpy = jest
        .spyOn(awsDal, 'getObjectUrl')
        .mockResolvedValueOnce('http://document');

      const result = await service.getDocumentDetail('id');

      expect(getUrlSpy).toBeCalledWith('thefile.pdf');

      expect(result).toMatchObject({
        url: 'http://document',
        document: {
          title: 'Title',
          uri: 'thefile.pdf',
        },
      });
    });
  });

  describe('getDocumentUrl', () => {
    it('should return the presigned url', async () => {
      const getUrlSpy = jest
        .spyOn(awsDal, 'getObjectUrl')
        .mockResolvedValueOnce('http://document');

      const result = await service.getDocumentUrl('key');

      expect(getUrlSpy).toBeCalledWith('key');
      expect(result).toEqual('http://document');
    });
  });

  describe('getDocumentMeta', () => {
    it('should request and return the object meta data', async () => {
      const response = {
        uuid: 'id',
        uploadeddate: 'data',
        filename: 'file',
      };
      const getMetaSpy = jest
        .spyOn(awsDal, 'getObjectMeta')
        .mockResolvedValueOnce(response);

      const result = await service.getDocumentMeta('key');

      expect(getMetaSpy).toBeCalledWith('key');
      expect(result).toEqual(response);
    });
  });

  describe('deleteDocument', () => {
    it('should request and return the object meta data', async () => {
      const deleteSpy = jest
        .spyOn(awsDal, 'deleteObject')
        .mockResolvedValueOnce({ deleted: 'key' });

      const result = await service.deleteDocument('key');

      expect(deleteSpy).toBeCalledWith('key');
      expect(result).toEqual({ deleted: 'key' });
    });
  });

  describe('confirmDocument', () => {
    it('should copy object with unconfirmed/ removed from key and delete original object', async () => {
      const deleteSpy = jest
        .spyOn(awsDal, 'deleteObject')
        .mockResolvedValueOnce({ deleted: 'key' });

      const copySpy = jest
        .spyOn(awsDal, 'copyObject')
        .mockResolvedValueOnce({ from: 'key', to: 'key2' });

      const result = await service.confirmDocument('unconfirmed/key');

      expect(copySpy).toBeCalledWith('unconfirmed/key', 'key');
      expect(deleteSpy).toBeCalledWith('unconfirmed/key');
      expect(result).toEqual('key');
    });
  });

  describe('updateMeta', () => {
    it('should request and return the object meta data', async () => {
      const updateSpy = jest
        .spyOn(awsDal, 'updateMetaData')
        .mockResolvedValueOnce({ updated: 'key' });

      const result = await service.updateMeta('key', { status: 'published' });

      expect(updateSpy).toBeCalledWith('key', { status: 'published' });
      expect(result).toEqual({ updated: 'key' });
    });
  });

  describe('getTnaDocument', () => {
    it('should request and map when EU document', async () => {
      jest
        .spyOn(tnaDal, 'getDocumentById')
        .mockResolvedValueOnce(tnaEuDocumentMockJson);

      const result = await service.getTnaDocument('href');

      expect(result).toEqual({
        docType: 'European Union Legislation',
        number: '18',
        title: 'EU Doc Title',
        year: '2003',
      });
    });

    it('should request and map when UK document', async () => {
      // done to avoid confusing jest mocking
      const resp = tnaUkDocumentMockJson as unknown as TnaEuDoc;
      jest.spyOn(tnaDal, 'getDocumentById').mockResolvedValueOnce(resp);

      const result = await service.getTnaDocument('href');

      expect(result).toEqual({
        docType: 'Secondary',
        number: '632',
        title: 'UK Doc Title',
        year: '2012',
      });
    });
  });
});
