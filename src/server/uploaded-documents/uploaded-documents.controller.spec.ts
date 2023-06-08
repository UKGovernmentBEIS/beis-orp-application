import { Test, TestingModule } from '@nestjs/testing';
import { UploadedDocumentsController } from './uploaded-documents.controller';
import { UploadedDocumentsService } from './uploaded-documents.service';
import { OrpDal } from '../data/orp.dal';
import { mockLogger } from '../../../test/mocks/logger.mock';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { HttpModule } from '@nestjs/axios';
import { DEFAULT_USER_WITH_REGULATOR } from '../../../test/mocks/user.mock';
import { DocumentService } from '../document/document.service';
import { getMappedOrpDocument } from '../../../test/mocks/orpSearchMock';
import { mockAwsDal } from '../../../test/mocks/uploadMocks';
import { TnaDal } from '../data/tna.dal';
import { ForbiddenException } from '@nestjs/common';
import { documentTypes } from '../search/entities/document-types';
import { topicsDisplayMap } from '../document/utils/topics-display-mapping';
import { topics } from '../document/utils/topics';
import { FULL_TOPIC_PATH } from '../../../test/mocks/topics';

describe('UploadedDocumentsController', () => {
  let controller: UploadedDocumentsController;
  let myDocsService: UploadedDocumentsService;
  let documentService: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadedDocumentsController],
      providers: [
        UploadedDocumentsService,
        OrpDal,
        mockLogger,
        mockConfigService,
        DocumentService,
        mockAwsDal,
        TnaDal,
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<UploadedDocumentsController>(
      UploadedDocumentsController,
    );
    myDocsService = module.get<UploadedDocumentsService>(
      UploadedDocumentsService,
    );

    documentService = module.get<DocumentService>(DocumentService);
  });

  describe('findAll', () => {
    it('should call findAll on uploadedDocumentsService', async () => {
      const searchResponse = {
        totalSearchResults: 10,
        documents: [],
      };

      const expectedResult = {
        searchResponse: searchResponse,
        title: 'Uploaded documents (page 1 of 1)',
        pagination: {
          pageOn: 1,
          nextValue: null,
          prevValue: null,
          pagesToShow: [1],
          titlePostfix: ' (page 1 of 1)',
          totalPages: 1,
        },
      };

      jest.spyOn(myDocsService, 'findAll').mockResolvedValue(searchResponse);
      const result = await controller.findAll(DEFAULT_USER_WITH_REGULATOR, {});
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getDocumentDetails', () => {
    it('should call getDocumentById on DocumentsService', async () => {
      const document = getMappedOrpDocument({
        regulatorId: DEFAULT_USER_WITH_REGULATOR.regulator.id,
      });
      const getByIdMock = jest
        .spyOn(documentService, 'getDocumentById')
        .mockResolvedValue(document);
      const result = await controller.getDocumentDetails(
        { id: 'id' },
        DEFAULT_USER_WITH_REGULATOR,
      );

      expect(getByIdMock).toBeCalledWith('id');
      expect(result).toEqual({ document, title: `${document.title} details` });
    });

    it('should throw if not from same regulator', async () => {
      const document = getMappedOrpDocument();

      jest
        .spyOn(documentService, 'getDocumentById')
        .mockResolvedValue(document);

      return expect(
        controller.getDocumentDetails(
          { id: 'id' },
          DEFAULT_USER_WITH_REGULATOR,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('getUpdateDocumentType', () => {
    it('should call getDocumentById on DocumentsService and return document type information', async () => {
      const document = getMappedOrpDocument({
        regulatorId: DEFAULT_USER_WITH_REGULATOR.regulator.id,
      });
      const getByIdMock = jest
        .spyOn(documentService, 'getDocumentById')
        .mockResolvedValue(document);
      const result = await controller.getUpdateDocumentType(
        { id: 'id' },
        DEFAULT_USER_WITH_REGULATOR,
      );

      expect(getByIdMock).toBeCalledWith('id');
      expect(result).toEqual({
        key: document.uri,
        id: 'id',
        selected: document.documentTypeId,
        documentTypes,
        title: 'Update document type',
      });
    });

    it('should throw if not from same regulator', async () => {
      const document = getMappedOrpDocument();

      jest
        .spyOn(documentService, 'getDocumentById')
        .mockResolvedValue(document);

      return expect(
        controller.getUpdateDocumentType(
          { id: 'id' },
          DEFAULT_USER_WITH_REGULATOR,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('postDocType', () => {
    it('call updateMeta on document service', async () => {
      const updateMock = jest
        .spyOn(documentService, 'updateMeta')
        .mockResolvedValue({ updated: true });

      await controller.postDocType(
        { key: 'key', documentType: 'GD' },
        { id: 'id' },
        DEFAULT_USER_WITH_REGULATOR,
      );

      expect(updateMock).toBeCalledWith(
        'key',
        { document_type: 'GD' },
        DEFAULT_USER_WITH_REGULATOR,
      );
    });
  });

  describe('getUpdateDocumentTopics', () => {
    it('should call getDocumentById on DocumentsService and return document topics information', async () => {
      const document = getMappedOrpDocument({
        regulatorId: DEFAULT_USER_WITH_REGULATOR.regulator.id,
      });
      const getByIdMock = jest
        .spyOn(documentService, 'getDocumentById')
        .mockResolvedValue(document);
      const result = await controller.getUpdateDocumentTopics(
        { id: 'id' },
        DEFAULT_USER_WITH_REGULATOR,
      );

      expect(getByIdMock).toBeCalledWith('id');
      expect(result).toEqual({
        key: document.uri,
        id: 'id',
        topicsForSelections: [
          Object.keys(topics),
          Object.keys(topics[FULL_TOPIC_PATH[0]]),
          Object.keys(topics[FULL_TOPIC_PATH[0]][FULL_TOPIC_PATH[1]]),
        ],
        selectedTopics: FULL_TOPIC_PATH,
        topicsDisplayMap,
        title: 'Update document topics',
      });
    });

    it('should throw if not from same regulator', async () => {
      const document = getMappedOrpDocument();

      jest
        .spyOn(documentService, 'getDocumentById')
        .mockResolvedValue(document);

      return expect(
        controller.getUpdateDocumentTopics(
          { id: 'id' },
          DEFAULT_USER_WITH_REGULATOR,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('getUpdateDocumentStatus', () => {
    it('should call getDocumentById on DocumentsService and return document status information', async () => {
      const document = getMappedOrpDocument({
        regulatorId: DEFAULT_USER_WITH_REGULATOR.regulator.id,
      });
      const getByIdMock = jest
        .spyOn(documentService, 'getDocumentById')
        .mockResolvedValue(document);
      const result = await controller.getUpdateDocumentStatus(
        { id: 'id' },
        DEFAULT_USER_WITH_REGULATOR,
      );

      expect(getByIdMock).toBeCalledWith('id');
      expect(result).toEqual({
        key: document.uri,
        id: 'id',
        selected: 'published',
        title: 'Update document status',
      });
    });

    it('should throw if not from same regulator', async () => {
      const document = getMappedOrpDocument();

      jest
        .spyOn(documentService, 'getDocumentById')
        .mockResolvedValue(document);

      return expect(
        controller.getUpdateDocumentStatus(
          { id: 'id' },
          DEFAULT_USER_WITH_REGULATOR,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('postUpdateDocumentStatus', () => {
    it('call updateMeta on document service', async () => {
      const updateMock = jest
        .spyOn(documentService, 'updateMeta')
        .mockResolvedValue({ updated: true });

      await controller.postUpdateDocumentStatus(
        { key: 'key', status: 'published' },
        { id: 'id' },
        DEFAULT_USER_WITH_REGULATOR,
      );

      expect(updateMock).toBeCalledWith(
        'key',
        { status: 'published' },
        DEFAULT_USER_WITH_REGULATOR,
      );
    });
  });

  describe('delete', () => {
    it('should get doc and return relevant details', async () => {
      const document = getMappedOrpDocument({
        regulatorId: DEFAULT_USER_WITH_REGULATOR.regulator.id,
      });
      const getByIdMock = jest
        .spyOn(documentService, 'getDocumentById')
        .mockResolvedValue(document);

      const result = await controller.delete(
        { id: 'id' },
        DEFAULT_USER_WITH_REGULATOR,
      );

      expect(getByIdMock).toBeCalledWith('id');
      expect(result).toEqual({
        documentId: 'id',
        publishedDate: '2018-08-06T00:00:00Z',
        documentTitle: 'Title',
        title: 'Delete document: Title',
      });
    });

    it('should throw if not from same regulator', async () => {
      const document = getMappedOrpDocument();

      jest
        .spyOn(documentService, 'getDocumentById')
        .mockResolvedValue(document);

      return expect(
        controller.delete({ id: 'id' }, DEFAULT_USER_WITH_REGULATOR),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('postDeleteDocument', () => {
    it('call deleteDocument on document service', async () => {
      const updateMock = jest
        .spyOn(documentService, 'deleteDocument')
        .mockResolvedValue({ status_description: 'OK', status_code: 200 });

      await controller.postDeleteDocument(
        { id: 'uuid' },
        DEFAULT_USER_WITH_REGULATOR,
      );

      expect(updateMock).toBeCalledWith('uuid', DEFAULT_USER_WITH_REGULATOR);
    });
  });

  describe('success', () => {
    it('returns id and title', async () => {
      const response = controller.success({ id: 'id' });

      expect(response).toEqual({
        documentId: 'id',
        title: 'Document successfully updated',
      });
    });
  });

  describe('deleted', () => {
    it('returns id and title', async () => {
      const response = controller.deleted({ id: 'id' });

      expect(response).toEqual({
        documentId: 'id',
        title: 'Document deleted',
      });
    });
  });
});
