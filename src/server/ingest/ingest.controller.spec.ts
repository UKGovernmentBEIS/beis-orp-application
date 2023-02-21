import { Test, TestingModule } from '@nestjs/testing';
import { IngestController } from './ingest.controller';
import { DocumentService } from '../document/document.service';
import { AwsDal } from '../data/aws.dal';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { Logger } from '@nestjs/common';
import { getPdfAsMulterFile } from '../../../test/mocks/uploadMocks';
import { OrpDal } from '../data/orp.dal';
import { HttpModule } from '@nestjs/axios';
import { DEFAULT_USER_WITH_REGULATOR } from '../../../test/mocks/prismaService.mock';
import { documentTypes } from '../search/types/documentTypes';

describe('IngestController', () => {
  let controller: IngestController;
  let documentService: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestController],
      providers: [DocumentService, AwsDal, OrpDal, mockConfigService, Logger],
      imports: [HttpModule],
    }).compile();

    controller = module.get<IngestController>(IngestController);
    documentService = module.get<DocumentService>(DocumentService);
  });

  describe('uploadFile', () => {
    it('should call aws uploader with file and redirect to confirm page', async () => {
      const result = { key: 'file.pdf', id: '123' };
      jest.spyOn(documentService, 'upload').mockResolvedValue(result);

      const file = await getPdfAsMulterFile();
      const expectedResult = await controller.uploadFile(
        file,
        DEFAULT_USER_WITH_REGULATOR,
      );

      expect(expectedResult).toEqual({ url: '/ingest/confirm?key=file.pdf' });
    });
  });

  describe('confirm', () => {
    describe('confirm GET', () => {
      it('should call aws uploader with file and redirect to confirm page', async () => {
        jest.spyOn(documentService, 'getDocumentUrl').mockResolvedValue('url');

        const expectedResult = await controller.confirm({ key: 'key' });

        expect(expectedResult).toEqual({ url: 'url', key: 'key' });
      });
    });

    describe('confirm POST', () => {
      it('should delete doc and redirect to upload page if answer no', async () => {
        const deleteMock = jest
          .spyOn(documentService, 'deleteDocument')
          .mockResolvedValue({ deleted: 'key' });

        const expectedResult = await controller.confirmPost({
          confirm: 'no',
          key: 'key',
        });

        expect(deleteMock).toBeCalledTimes(1);
        expect(expectedResult).toEqual({ url: '/ingest/upload' });
      });

      it('should redirect to doc type page if answer is yes without deleting doc', async () => {
        const deleteMock = jest
          .spyOn(documentService, 'deleteDocument')
          .mockResolvedValue({ deleted: 'key' });

        const expectedResult = await controller.confirmPost({
          confirm: 'yes',
          key: 'key',
        });

        expect(deleteMock).toBeCalledTimes(0);
        expect(expectedResult).toEqual({
          url: '/ingest/document-type?key=key',
        });
      });
    });
  });

  describe('document type', () => {
    describe('chooseDocType GET', () => {
      it('should get the doc meta data and return the selected doctype', async () => {
        const metaMock = jest
          .spyOn(documentService, 'getDocumentMeta')
          .mockResolvedValue({
            filename: 'fn',
            uuid: 'id',
            uploadeddate: 'data',
            documenttype: 'GD',
          });

        const expectedResult = await controller.chooseDocType({
          key: 'key',
        });

        expect(metaMock).toBeCalledTimes(1);
        expect(expectedResult).toEqual({
          key: 'key',
          selected: 'GD',
          documentTypes,
        });
      });
    });

    describe('postDocType POST', () => {
      it('should call updateMeta on documentService', async () => {
        const updateMock = jest
          .spyOn(documentService, 'updateMeta')
          .mockResolvedValue({ updated: 'key' });

        const expectedResult = await controller.postDocType({
          key: 'key',
          documentType: 'GD',
        });

        expect(updateMock).toBeCalledTimes(1);
        expect(updateMock).toBeCalledWith('key', { documentType: 'GD' });
        expect(expectedResult).toEqual({ url: `/ingest/submit?key=key` });
      });
    });
  });

  describe('submit', () => {
    describe('submit GET', () => {
      it('should get the doc meta data and return the details', async () => {
        const metaMock = jest
          .spyOn(documentService, 'getDocumentMeta')
          .mockResolvedValue({
            filename: 'fn',
            uuid: 'id',
            uploadeddate: 'data',
          });

        const expectedResult = await controller.submit({
          key: 'key',
        });

        expect(metaMock).toBeCalledTimes(1);
        expect(expectedResult).toEqual({
          file: 'fn',
          key: 'key',
          documentType: 'Other',
        });
      });
    });

    describe('submit POST', () => {
      it('should call confirmDocument on documentService', async () => {
        const confirmMock = jest
          .spyOn(documentService, 'confirmDocument')
          .mockResolvedValue('newKey');

        const expectedResult = await controller.submitPost({
          key: 'key',
        });

        expect(confirmMock).toBeCalledTimes(1);
        expect(expectedResult).toEqual({ url: '/ingest/success?key=newKey' });
      });
    });
  });
  describe('success', () => {
    it('should get the doc meta data and return the id', async () => {
      const metaMock = jest
        .spyOn(documentService, 'getDocumentMeta')
        .mockResolvedValue({
          filename: 'fn',
          uuid: 'id',
          uploadeddate: 'data',
        });

      const expectedResult = await controller.success({
        key: 'key',
      });

      expect(metaMock).toBeCalledTimes(1);
      expect(expectedResult).toEqual({ id: 'id' });
    });
  });
});
