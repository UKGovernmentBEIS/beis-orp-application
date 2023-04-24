import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { OrpDal } from '../data/orp.dal';
import { AwsDal } from '../data/aws.dal';
import { HttpModule } from '@nestjs/axios';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { Logger } from '@nestjs/common';
import {
  getMappedOrpDocument,
  getRawOrpDocument,
} from '../../../test/mocks/orpSearchMock';
import {
  getPdfAsMulterFile,
  getPdfBuffer,
} from '../../../test/mocks/uploadMocks';
import { Readable } from 'stream';
import { TnaDal } from '../data/tna.dal';
import {
  tnaEuDocumentMockJson,
  tnaUkPrimaryLegislationDocumentMockJson,
  tnaUkSecondaryLegislationDocumentMockJson,
} from '../../../test/mocks/tnaDocumentsMock';
import { TnaEuDoc } from '../data/types/tnaDocs';
import { DEFAULT_USER_WITH_REGULATOR } from '../../../test/mocks/user.mock';
import { FULL_TOPIC_PATH } from '../../../test/mocks/topics';

jest.mock('uuid', () => {
  return { v4: jest.fn(() => 'UUID') };
});

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

  describe('upload', () => {
    it('call upload on aws dal', async () => {
      const file = await getPdfAsMulterFile();
      const awsSpy = jest
        .spyOn(awsDal, 'upload')
        .mockResolvedValue({ key: 'key', id: 'id' });

      const result = await service.upload(
        file,
        DEFAULT_USER_WITH_REGULATOR,
        true,
      );

      expect(awsSpy).toBeCalledWith(
        file,
        DEFAULT_USER_WITH_REGULATOR.cognitoUsername,
        DEFAULT_USER_WITH_REGULATOR.regulator.id,
        {},
        true,
      );
      expect(result).toEqual({ key: 'key', id: 'id' });
    });
  });

  describe('uploadFromApi', () => {
    it('call upload on aws dal with api_user as true', async () => {
      const file = await getPdfAsMulterFile();
      const apiRegUser = { cognitoUsername: 'cogName', regulator: 'regName' };
      const fileMeta = {
        status: 'published' as const,
        document_type: 'GD' as const,
      };

      const awsSpy = jest
        .spyOn(awsDal, 'upload')
        .mockResolvedValue({ key: 'key', id: 'id' });

      const result = await service.uploadFromApi(file, apiRegUser, fileMeta);

      expect(awsSpy).toBeCalledWith(
        file,
        apiRegUser.cognitoUsername,
        apiRegUser.regulator,
        { ...fileMeta, api_user: 'true' },
      );
      expect(result).toEqual({ key: 'key', id: 'id' });
    });

    it('sends the topics path from mapping', async () => {
      const file = await getPdfAsMulterFile();
      const apiRegUser = { cognitoUsername: 'cogName', regulator: 'regName' };
      const fileMeta = {
        status: 'published' as const,
        document_type: 'GD' as const,
        topics: FULL_TOPIC_PATH.at(-1),
      };

      const awsSpy = jest
        .spyOn(awsDal, 'upload')
        .mockResolvedValue({ key: 'key', id: 'id' });

      const result = await service.uploadFromApi(file, apiRegUser, fileMeta);

      expect(awsSpy).toBeCalledWith(
        file,
        apiRegUser.cognitoUsername,
        apiRegUser.regulator,
        {
          ...fileMeta,
          api_user: 'true',
          topics: JSON.stringify(FULL_TOPIC_PATH),
        },
      );
      expect(result).toEqual({ key: 'key', id: 'id' });
    });
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

      const result = await service.getDocumentStream('id');

      expect(getObjSpy).toBeCalledWith('thefile.pdf');
      expect(result).toBeInstanceOf(Readable);
    });
  });

  describe('getDocumentById', () => {
    it('should return the document search data', async () => {
      jest.spyOn(orpDal, 'getById').mockResolvedValue(getRawOrpDocument());

      const result = await service.getDocumentById('id');

      expect(result).toEqual(getMappedOrpDocument());
    });
  });

  describe('getDocumentUrl', () => {
    test.each`
      format     | mime
      ${'pdf'}   | ${'application/pdf'}
      ${'.docx'} | ${'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
    `('should return the presigned url if doc is $format', async ({ mime }) => {
      jest.spyOn(awsDal, 'getObjectMeta').mockResolvedValueOnce({
        document_format: mime,
        uuid: '1',
        uploaded_date: '2022-01-24T12:54:49Z',
        file_name: 'fn',
      });

      const getUrlSpy = jest
        .spyOn(awsDal, 'getObjectUrl')
        .mockResolvedValueOnce('http://document');

      const result = await service.getDocumentUrl('key');

      expect(getUrlSpy).toBeCalledWith('key');
      expect(result).toEqual({
        url: 'http://document',
        documentFormat: mime,
      });
    });

    it('should not get presignedUrl if undisplayable type', async () => {
      jest.spyOn(awsDal, 'getObjectMeta').mockResolvedValueOnce({
        document_format: 'application/vnd.oasis.opendocument.text',
        uuid: '1',
        uploaded_date: '2022-01-24T12:54:49Z',
        file_name: 'fn',
      });

      const getUrlSpy = jest
        .spyOn(awsDal, 'getObjectUrl')
        .mockResolvedValueOnce('http://document');

      const result = await service.getDocumentUrl('key');

      expect(getUrlSpy).toBeCalledTimes(0);
      expect(result).toEqual({
        url: null,
        documentFormat: 'application/vnd.oasis.opendocument.text',
      });
    });
  });

  describe('getDocumentMeta', () => {
    it('should request and return the object meta data', async () => {
      const response = {
        uuid: 'id',
        uploaded_date: 'data',
        file_name: 'file',
        document_format: 'application/pdf',
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

  describe('ingestUrl', () => {
    it('should add ids to payload and call orpDal', async () => {
      const ingestSpy = jest
        .spyOn(orpDal, 'ingestUrl')
        .mockResolvedValueOnce('key');

      const payload = {
        document_type: 'GD',
        status: 'draft',
        topics: JSON.stringify(FULL_TOPIC_PATH),
        uri: 'www.gov.uk',
      };

      const result = await service.ingestUrl(
        payload,
        DEFAULT_USER_WITH_REGULATOR,
      );

      expect(ingestSpy).toBeCalledWith({
        ...payload,
        user_id: DEFAULT_USER_WITH_REGULATOR.cognitoUsername,
        regulator_id: DEFAULT_USER_WITH_REGULATOR.regulator.id,
        uuid: 'UUID',
      });
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

    it('should request and map when UK Primary legislation document', async () => {
      // done to avoid confusing jest mocking
      const resp =
        tnaUkPrimaryLegislationDocumentMockJson as unknown as TnaEuDoc;
      jest.spyOn(tnaDal, 'getDocumentById').mockResolvedValueOnce(resp);

      const result = await service.getTnaDocument('href');

      expect(result).toEqual({
        docType: 'Primary',
        number: '42',
        title: 'Human Rights Act 1998',
        year: '1998',
      });
    });

    it('should request and map when UK Secondary legislation document', async () => {
      // done to avoid confusing jest mocking
      const resp =
        tnaUkSecondaryLegislationDocumentMockJson as unknown as TnaEuDoc;
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
