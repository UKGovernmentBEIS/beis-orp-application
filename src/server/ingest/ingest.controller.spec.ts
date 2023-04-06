import { Test, TestingModule } from '@nestjs/testing';
import { IngestController } from './ingest.controller';
import { DocumentService } from '../document/document.service';
import { AwsDal } from '../data/aws.dal';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { Logger } from '@nestjs/common';
import { getPdfAsMulterFile } from '../../../test/mocks/uploadMocks';
import { OrpDal } from '../data/orp.dal';
import { HttpModule } from '@nestjs/axios';
import { DEFAULT_USER_WITH_REGULATOR } from '../../../test/mocks/user.mock';
import { documentTypes } from '../search/types/documentTypes';
import { TnaDal } from '../data/tna.dal';
import { topicsDisplayMap } from '../document/utils/topics-display-mapping';
import { topics } from '../document/utils/topics';
import { FULL_TOPIC_PATH } from '../../../test/mocks/topics';
import * as mocks from 'node-mocks-http';

describe('IngestController', () => {
  let controller: IngestController;
  let documentService: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestController],
      providers: [
        DocumentService,
        AwsDal,
        OrpDal,
        mockConfigService,
        Logger,
        TnaDal,
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<IngestController>(IngestController);
    documentService = module.get<DocumentService>(DocumentService);
  });

  describe('uploading from device', () => {
    describe('uploadFile', () => {
      it('should call aws uploader with file and redirect to document-type page', async () => {
        const result = { key: 'file.pdf', id: '123' };
        jest.spyOn(documentService, 'upload').mockResolvedValue(result);

        const file = await getPdfAsMulterFile();
        const expectedResult = await controller.uploadFile(
          file,
          { uploadType: 'device' },
          DEFAULT_USER_WITH_REGULATOR,
        );

        expect(expectedResult).toEqual({
          url: '/ingest/document-type?key=file.pdf',
        });
      });
    });

    describe('document type', () => {
      describe('chooseDocType GET', () => {
        it('should get the doc meta data and return the selected doctype', async () => {
          const metaMock = jest
            .spyOn(documentService, 'getDocumentMeta')
            .mockResolvedValue({
              file_name: 'fn',
              uuid: 'id',
              uploaded_date: 'data',
              document_type: 'GD',
              document_format: 'application/pdf',
            });
          const req = mocks.createRequest({
            session: {},
          });

          const expectedResult = await controller.chooseDocType(
            {
              key: 'key',
            },
            req,
          );

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

          const req = mocks.createRequest({
            session: {},
          });

          const expectedResult = await controller.postDocType(
            {
              key: 'key',
              documentType: 'GD',
            },
            req,
          );

          expect(updateMock).toBeCalledTimes(1);
          expect(updateMock).toBeCalledWith('key', { document_type: 'GD' });
          expect(expectedResult).toEqual({
            url: `/ingest/document-topics?key=key`,
          });
        });
      });
    });

    describe('document topics', () => {
      const selectedTopics = FULL_TOPIC_PATH;

      describe('tagTopics GET', () => {
        it('should get the doc meta data and return the topic details', async () => {
          const metaMock = jest
            .spyOn(documentService, 'getDocumentMeta')
            .mockResolvedValue({
              file_name: 'fn',
              uuid: 'id',
              uploaded_date: 'data',
              document_type: 'GD',
              document_format: 'application/pdf',
              topics: JSON.stringify(selectedTopics),
            });

          const req = mocks.createRequest({
            session: {},
          });

          const expectedResult = await controller.tagTopics(
            { key: 'key' },
            req,
          );

          expect(metaMock).toBeCalledTimes(1);
          expect(expectedResult).toEqual({
            key: 'key',
            topicsForSelections: [
              Object.keys(topics),
              Object.keys(topics[selectedTopics[0]]),
              Object.keys(topics[selectedTopics[0]][selectedTopics[1]]),
            ],
            topicsDisplayMap,
            selectedTopics,
          });
        });
      });
      describe('postTagTopics POST', () => {
        it('should call updateMeta on documentService', async () => {
          const updateMock = jest
            .spyOn(documentService, 'updateMeta')
            .mockResolvedValue({ updated: 'key' });

          const req = mocks.createRequest({
            session: {},
          });

          const expectedResult = await controller.postTagTopics(
            {
              key: 'key',
              topic1: selectedTopics[0],
              topic2: selectedTopics[1],
              topic3: selectedTopics[2],
            },
            req,
          );

          expect(updateMock).toBeCalledTimes(1);
          expect(updateMock).toBeCalledWith('key', {
            topics: JSON.stringify(selectedTopics),
          });
          expect(expectedResult).toEqual({
            url: `/ingest/document-status?key=key`,
          });
        });
      });
    });

    describe('document status', () => {
      describe('chooseDraft GET', () => {
        it('should get the doc meta data and return the status', async () => {
          const metaMock = jest
            .spyOn(documentService, 'getDocumentMeta')
            .mockResolvedValue({
              file_name: 'fn',
              uuid: 'id',
              uploaded_date: 'data',
              document_type: 'GD',
              status: 'published',
              document_format: 'application/pdf',
            });
          const req = mocks.createRequest({
            session: {},
          });

          const expectedResult = await controller.chooseDraft(
            {
              key: 'key',
            },
            req,
          );

          expect(metaMock).toBeCalledTimes(1);
          expect(expectedResult).toEqual({
            key: 'key',
            selected: 'published',
          });
        });
      });

      describe('postDraft POST', () => {
        it('should call updateMeta on documentService', async () => {
          const updateMock = jest
            .spyOn(documentService, 'updateMeta')
            .mockResolvedValue({ updated: 'key' });

          const req = mocks.createRequest({
            session: {},
          });

          const expectedResult = await controller.postDraft(
            {
              key: 'key',
              status: 'published',
            },
            req,
          );

          expect(updateMock).toBeCalledTimes(1);
          expect(updateMock).toBeCalledWith('key', { status: 'published' });
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
              file_name: 'fn',
              uuid: 'id',
              uploaded_date: 'data',
              status: 'published',
              document_format: 'application/pdf',
              topics: JSON.stringify(['/entering-staying-uk']),
            });

          const req = mocks.createRequest({
            session: {},
          });
          const res = { render: jest.fn() };

          const getUrlMock = jest
            .spyOn(documentService, 'getDocumentUrl')
            .mockResolvedValue({
              documentFormat: 'application/pdf',
              url: 'url',
            });

          const expectedResult = await controller.submit({ key: 'key' }, req);

          expect(metaMock).toBeCalledTimes(1);
          expect(getUrlMock).toBeCalledTimes(1);
          expect(expectedResult).toEqual({
            documentFormat: 'application/pdf',
            file: 'fn',
            key: 'key',
            documentType: 'Other',
            documentStatus: 'Active',
            url: 'url',
            documentTopics: ['Entering and staying in the UK'],
          });
        });
      });

      describe('submit POST', () => {
        it('should call confirmDocument on documentService', async () => {
          const confirmMock = jest
            .spyOn(documentService, 'confirmDocument')
            .mockResolvedValue('newKey');

          const req = mocks.createRequest({
            session: {},
          });

          const expectedResult = await controller.submitPost(
            {
              key: 'key',
            },
            req,
            DEFAULT_USER_WITH_REGULATOR,
          );

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
            file_name: 'fn',
            uuid: 'id',
            uploaded_date: 'data',
            document_format: 'application/pdf',
          });

        const req = mocks.createRequest({
          session: {},
        });

        const expectedResult = await controller.success(
          {
            key: 'key',
          },
          req,
        );

        expect(metaMock).toBeCalledTimes(1);
        expect(expectedResult).toEqual({ id: 'id' });
      });
    });
  });

  describe('uploading from url', () => {
    describe('ingestHtml', () => {
      it('should call store url in session and redirect to document-type page', async () => {
        const req = mocks.createRequest({
          session: {},
        });

        const expectedResult = await controller.ingestHtml(
          { uploadType: 'url', url: 'something.gov.uk' },
          req,
        );

        expect(req.session).toEqual({
          urlIngestion: { uri: 'something.gov.uk' },
        });
        expect(expectedResult).toEqual({
          url: '/ingest/document-type?key=url',
        });
      });
    });

    describe('document type', () => {
      describe('chooseDocType GET', () => {
        it('should return selected doctype', async () => {
          const req = mocks.createRequest({
            session: {
              urlIngestion: {
                uri: 'something.gov.uk',
                document_type: 'GD',
              },
            },
          });

          const expectedResult = await controller.chooseDocType(
            {
              key: 'url',
            },
            req,
          );

          expect(expectedResult).toEqual({
            key: 'url',
            selected: 'GD',
            documentTypes,
          });
        });

        it('should throw if no uri in  session', async () => {
          const req = mocks.createRequest({
            session: {},
          });

          return expect(
            async () => await controller.chooseDocType({ key: 'url' }, req),
          ).rejects.toBeInstanceOf(Error);
        });
      });

      describe('postDocType POST', () => {
        it('should store doc type in session', async () => {
          const req = mocks.createRequest({
            session: {
              urlIngestion: {
                uri: 'something.gov.uk',
              },
            },
          });

          const expectedResult = await controller.postDocType(
            {
              key: 'url',
              documentType: 'GD',
            },
            req,
          );

          expect(req.session).toEqual({
            urlIngestion: {
              uri: 'something.gov.uk',
              document_type: 'GD',
            },
          });
          expect(expectedResult).toEqual({
            url: `/ingest/document-topics?key=url`,
          });
        });
      });
    });

    describe('document topics', () => {
      const selectedTopics = FULL_TOPIC_PATH;

      describe('tagTopics GET', () => {
        it('should get the doc meta data and return the topic details', async () => {
          const req = mocks.createRequest({
            session: {
              urlIngestion: {
                uri: 'something.gov.uk',
                document_type: 'GD',
                topics: selectedTopics,
              },
            },
          });

          const expectedResult = await controller.tagTopics(
            { key: 'url' },
            req,
          );

          expect(expectedResult).toEqual({
            key: 'url',
            topicsForSelections: [
              Object.keys(topics),
              Object.keys(topics[selectedTopics[0]]),
              Object.keys(topics[selectedTopics[0]][selectedTopics[1]]),
            ],
            topicsDisplayMap,
            selectedTopics,
          });
        });

        it('should throw if no uri in  session', async () => {
          const req = mocks.createRequest({
            session: {},
          });

          return expect(
            async () => await controller.tagTopics({ key: 'url' }, req),
          ).rejects.toBeInstanceOf(Error);
        });
      });
      describe('postTagTopics POST', () => {
        it('should store topics on session', async () => {
          const req = mocks.createRequest({
            session: {
              urlIngestion: {
                uri: 'something.gov.uk',
                document_type: 'GD',
              },
            },
          });

          const expectedResult = await controller.postTagTopics(
            {
              key: 'url',
              topic1: selectedTopics[0],
              topic2: selectedTopics[1],
              topic3: selectedTopics[2],
            },
            req,
          );

          expect(req.session).toEqual({
            urlIngestion: {
              uri: 'something.gov.uk',
              document_type: 'GD',
              topics: selectedTopics,
            },
          });
          expect(expectedResult).toEqual({
            url: `/ingest/document-status?key=url`,
          });
        });
      });
    });

    describe('document status', () => {
      describe('chooseDraft GET', () => {
        it('should get the doc meta data and return the status', async () => {
          const req = mocks.createRequest({
            session: {
              urlIngestion: {
                uri: 'something.gov.uk',
                document_type: 'GD',
                topics: FULL_TOPIC_PATH,
                status: 'published',
              },
            },
          });

          const expectedResult = await controller.chooseDraft(
            {
              key: 'url',
            },
            req,
          );

          expect(expectedResult).toEqual({
            key: 'url',
            selected: 'published',
          });
        });

        it('should throw if no uri in  session', async () => {
          const req = mocks.createRequest({
            session: {},
          });

          return expect(
            async () => await controller.chooseDraft({ key: 'url' }, req),
          ).rejects.toBeInstanceOf(Error);
        });
      });

      describe('postDraft POST', () => {
        it('should store status on the session', async () => {
          const req = mocks.createRequest({
            session: {
              urlIngestion: {
                uri: 'something.gov.uk',
                document_type: 'GD',
                topics: FULL_TOPIC_PATH,
              },
            },
          });

          const expectedResult = await controller.postDraft(
            {
              key: 'url',
              status: 'published',
            },
            req,
          );

          expect(req.session).toEqual({
            urlIngestion: {
              uri: 'something.gov.uk',
              document_type: 'GD',
              topics: FULL_TOPIC_PATH,
              status: 'published',
            },
          });
          expect(expectedResult).toEqual({ url: `/ingest/submit?key=url` });
        });
      });
    });

    describe('submit', () => {
      describe('submit GET', () => {
        it('should get the session data and return the details', async () => {
          const req = mocks.createRequest({
            session: {
              urlIngestion: {
                uri: 'something.gov.uk',
                document_type: 'GD',
                topics: FULL_TOPIC_PATH,
                status: 'published',
              },
            },
          });

          const expectedResult = await controller.submit({ key: 'url' }, req);

          expect(expectedResult).toEqual({
            file: 'something.gov.uk',
            key: 'url',
            documentType: 'Guidance',
            documentStatus: 'Active',
            documentFormat: 'url',
            documentTopics: [
              'Entering and staying in the UK',
              'Immigration offences',
              'Immigration penalties',
            ],
          });
        });

        it('should throw if no uri in  session', async () => {
          const req = mocks.createRequest({
            session: {},
          });

          return expect(
            async () => await controller.submit({ key: 'url' }, req),
          ).rejects.toBeInstanceOf(Error);
        });
      });

      describe('submit POST', () => {
        it('should call confirmDocument on documentService', async () => {
          const ingestUrlMock = jest
            .spyOn(documentService, 'ingestUrl')
            .mockResolvedValue('newKey');

          const req = mocks.createRequest({
            session: {
              urlIngestion: {
                uri: 'something.gov.uk',
                document_type: 'GD',
                topics: FULL_TOPIC_PATH,
                status: 'published',
              },
            },
          });

          const expectedResult = await controller.submitPost(
            {
              key: 'url',
            },
            req,
            DEFAULT_USER_WITH_REGULATOR,
          );

          expect(ingestUrlMock).toBeCalledTimes(1);
          expect(req.session).toEqual({
            urlIngestion: {
              uri: 'something.gov.uk',
              document_type: 'GD',
              topics: FULL_TOPIC_PATH,
              status: 'published',
              uuid: 'newKey',
            },
          });
          expect(expectedResult).toEqual({ url: '/ingest/success?key=url' });
        });
      });
    });
    describe('success', () => {
      it('should get the doc meta data and return the id', async () => {
        const req = mocks.createRequest({
          session: {
            urlIngestion: {
              uri: 'something.gov.uk',
              document_type: 'GD',
              topics: FULL_TOPIC_PATH,
              status: 'published',
              uuid: 'id',
            },
          },
        });

        const expectedResult = await controller.success(
          {
            key: 'url',
          },
          req,
        );

        expect(expectedResult).toEqual({ id: 'id' });
      });
    });
  });
});
