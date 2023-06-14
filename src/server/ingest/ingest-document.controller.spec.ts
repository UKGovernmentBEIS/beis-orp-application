import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from '../document/document.service';
import { AwsDal } from '../data/aws.dal';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { ForbiddenException, Logger } from '@nestjs/common';
import { getPdfAsMulterFile } from '../../../test/mocks/uploadMocks';
import { OrpDal } from '../data/orp.dal';
import { HttpModule } from '@nestjs/axios';
import { DEFAULT_USER_WITH_REGULATOR } from '../../../test/mocks/user.mock';
import { documentTypes } from '../search/entities/document-types';
import { TnaDal } from '../data/tna.dal';
import { topicsDisplayMap } from '../document/utils/topics-display-mapping';
import { topics } from '../document/utils/topics';
import { FULL_TOPIC_PATH } from '../../../test/mocks/topics';
import { OrpSearchMapper } from '../search/utils/orp-search-mapper';
import { RegulatorService } from '../regulator/regulator.service';
import { IngestDocumentController } from './ingest-document.controller';

describe('IngestDocumentController', () => {
  let controller: IngestDocumentController;
  let documentService: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestDocumentController],
      providers: [
        DocumentService,
        AwsDal,
        OrpDal,
        mockConfigService,
        Logger,
        TnaDal,
        OrpSearchMapper,
        RegulatorService,
      ],
      imports: [HttpModule],
    }).compile();

    controller = module.get<IngestDocumentController>(IngestDocumentController);
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
          DEFAULT_USER_WITH_REGULATOR,
        );

        expect(expectedResult).toEqual({
          key: 'file.pdf',
          url: '/ingest/document/document-type?key=file.pdf',
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
              regulator_id: DEFAULT_USER_WITH_REGULATOR.regulator.id,
            });

          const expectedResult = await controller.chooseDocType(
            {
              key: 'key',
            },
            DEFAULT_USER_WITH_REGULATOR,
          );

          expect(metaMock).toBeCalledTimes(1);
          expect(expectedResult).toEqual({
            key: 'key',
            selected: 'GD',
            documentTypes,
          });
        });

        it('throws if regulator ids do not match', async () => {
          jest.spyOn(documentService, 'getDocumentMeta').mockResolvedValue({
            file_name: 'fn',
            uuid: 'id',
            uploaded_date: 'data',
            document_type: 'GD',
            document_format: 'application/pdf',
            regulator_id: 'someotherregulator',
          });

          return expect(
            controller.chooseDocType(
              {
                key: 'key',
              },
              DEFAULT_USER_WITH_REGULATOR,
            ),
          ).rejects.toBeInstanceOf(ForbiddenException);
        });
      });

      describe('postDocType POST', () => {
        it('should call updateMeta on documentService', async () => {
          const updateMock = jest
            .spyOn(documentService, 'updateMeta')
            .mockResolvedValue({ updated: 'key' });

          const expectedResult = await controller.postDocType(
            {
              key: 'key',
              documentType: 'GD',
            },
            DEFAULT_USER_WITH_REGULATOR,
          );

          expect(updateMock).toBeCalledTimes(1);
          expect(updateMock).toBeCalledWith(
            'key',
            { document_type: 'GD' },
            DEFAULT_USER_WITH_REGULATOR,
          );
          expect(expectedResult).toEqual({
            url: `/ingest/document/document-topics?key=key`,
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
              regulator_id: DEFAULT_USER_WITH_REGULATOR.regulator.id,
              topics: JSON.stringify(selectedTopics),
            });

          const expectedResult = await controller.tagTopics(
            { key: 'key' },
            DEFAULT_USER_WITH_REGULATOR,
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

        it('throws if regulator ids do not match', async () => {
          jest.spyOn(documentService, 'getDocumentMeta').mockResolvedValue({
            file_name: 'fn',
            uuid: 'id',
            uploaded_date: 'data',
            document_type: 'GD',
            document_format: 'application/pdf',
            topics: JSON.stringify(selectedTopics),
            regulator_id: 'someotherregulator',
          });

          return expect(
            controller.tagTopics({ key: 'key' }, DEFAULT_USER_WITH_REGULATOR),
          ).rejects.toBeInstanceOf(ForbiddenException);
        });
      });

      describe('postTagTopics POST', () => {
        it('should call updateMeta on documentService', async () => {
          const updateMock = jest
            .spyOn(documentService, 'updateMeta')
            .mockResolvedValue({ updated: 'key' });

          const expectedResult = await controller.postTagTopics(
            {
              key: 'key',
              topic1: selectedTopics[0],
              topic2: selectedTopics[1],
              topic3: selectedTopics[2],
            },
            DEFAULT_USER_WITH_REGULATOR,
          );

          expect(updateMock).toBeCalledTimes(1);
          expect(updateMock).toBeCalledWith(
            'key',
            {
              topics: JSON.stringify(selectedTopics),
            },
            DEFAULT_USER_WITH_REGULATOR,
          );
          expect(expectedResult).toEqual({
            url: `/ingest/document/document-status?key=key`,
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
              regulator_id: DEFAULT_USER_WITH_REGULATOR.regulator.id,
            });

          const expectedResult = await controller.chooseDraft(
            {
              key: 'key',
            },
            DEFAULT_USER_WITH_REGULATOR,
          );

          expect(metaMock).toBeCalledTimes(1);
          expect(expectedResult).toEqual({
            key: 'key',
            selected: 'published',
          });
        });

        it('throws if regulator ids do not match', async () => {
          jest.spyOn(documentService, 'getDocumentMeta').mockResolvedValue({
            file_name: 'fn',
            uuid: 'id',
            uploaded_date: 'data',
            document_type: 'GD',
            status: 'published',
            document_format: 'application/pdf',
            regulator_id: 'someotherregulator',
          });

          return expect(
            controller.chooseDraft({ key: 'key' }, DEFAULT_USER_WITH_REGULATOR),
          ).rejects.toBeInstanceOf(ForbiddenException);
        });
      });

      describe('postDraft POST', () => {
        it('should call updateMeta on documentService', async () => {
          const updateMock = jest
            .spyOn(documentService, 'updateMeta')
            .mockResolvedValue({ updated: 'key' });

          const expectedResult = await controller.postDraft(
            {
              key: 'key',
              status: 'published',
            },
            DEFAULT_USER_WITH_REGULATOR,
          );

          expect(updateMock).toBeCalledTimes(1);
          expect(updateMock).toBeCalledWith(
            'key',
            { status: 'published' },
            DEFAULT_USER_WITH_REGULATOR,
          );
          expect(expectedResult).toEqual({
            url: `/ingest/document/submit?key=key`,
          });
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
              regulator_id: DEFAULT_USER_WITH_REGULATOR.regulator.id,
              topics: JSON.stringify(['/entering-staying-uk']),
            });

          const getUrlMock = jest
            .spyOn(documentService, 'getDocumentUrl')
            .mockResolvedValue({
              documentFormat: 'application/pdf',
              url: 'url',
            });

          const expectedResult = await controller.submit(
            { key: 'key' },
            DEFAULT_USER_WITH_REGULATOR,
          );

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

        it('throws if regulator ids do not match', async () => {
          jest.spyOn(documentService, 'getDocumentMeta').mockResolvedValue({
            file_name: 'fn',
            uuid: 'id',
            uploaded_date: 'data',
            status: 'published',
            document_format: 'application/pdf',
            topics: JSON.stringify(['/entering-staying-uk']),
            regulator_id: 'someotherregulator',
          });

          return expect(
            controller.submit({ key: 'key' }, DEFAULT_USER_WITH_REGULATOR),
          ).rejects.toBeInstanceOf(ForbiddenException);
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
          expect(expectedResult).toEqual({
            url: '/ingest/document/success?key=newKey',
          });
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
            regulator_id: DEFAULT_USER_WITH_REGULATOR.regulator.id,
          });

        const expectedResult = await controller.success(
          {
            key: 'key',
          },
          DEFAULT_USER_WITH_REGULATOR,
        );

        expect(metaMock).toBeCalledTimes(1);
        expect(expectedResult).toEqual({ id: 'id' });
      });
    });
  });
});
