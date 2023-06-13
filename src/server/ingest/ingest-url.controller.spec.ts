import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from '../document/document.service';
import { AwsDal } from '../data/aws.dal';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { Logger } from '@nestjs/common';
import { OrpDal } from '../data/orp.dal';
import { HttpModule } from '@nestjs/axios';
import { DEFAULT_USER_WITH_REGULATOR } from '../../../test/mocks/user.mock';
import { documentTypes } from '../search/entities/document-types';
import { TnaDal } from '../data/tna.dal';
import { topicsDisplayMap } from '../document/utils/topics-display-mapping';
import { topics } from '../document/utils/topics';
import { FULL_TOPIC_PATH } from '../../../test/mocks/topics';
import * as mocks from 'node-mocks-http';
import { OrpSearchMapper } from '../search/utils/orp-search-mapper';
import { RegulatorService } from '../regulator/regulator.service';
import { IngestUrlController } from './ingest-url.controller';

describe('IngestUrlController', () => {
  let controller: IngestUrlController;
  let documentService: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestUrlController],
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

    controller = module.get<IngestUrlController>(IngestUrlController);
    documentService = module.get<DocumentService>(DocumentService);
  });

  describe('uploading from url', () => {
    describe('ingestHtml', () => {
      it('should call store url in session and redirect to document-type page', async () => {
        const req = mocks.createRequest({
          session: {},
        });

        const expectedResult = await controller.ingestHtml(
          { url: 'something.gov.uk' },
          req,
        );

        expect(req.session).toEqual({
          urlIngestion: { uri: 'something.gov.uk' },
        });
        expect(expectedResult).toEqual({
          url: '/ingest/url/document-type',
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

          const expectedResult = await controller.chooseDocType(req);

          expect(expectedResult).toEqual({
            selected: 'GD',
            documentTypes,
          });
        });

        it('should throw if no uri in  session', async () => {
          const req = mocks.createRequest({
            session: {},
          });

          return expect(
            async () => await controller.chooseDocType(req),
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
            url: `/ingest/url/document-topics`,
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
            req,
            DEFAULT_USER_WITH_REGULATOR,
          );

          expect(expectedResult).toEqual({
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
            async () =>
              await controller.tagTopics(req, DEFAULT_USER_WITH_REGULATOR),
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
            url: `/ingest/url/document-status`,
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
            req,
            DEFAULT_USER_WITH_REGULATOR,
          );

          expect(expectedResult).toEqual({
            selected: 'published',
          });
        });

        it('should throw if no uri in  session', async () => {
          const req = mocks.createRequest({
            session: {},
          });

          return expect(
            async () =>
              await controller.chooseDraft(req, DEFAULT_USER_WITH_REGULATOR),
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
          expect(expectedResult).toEqual({ url: `/ingest/url/submit` });
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

          const expectedResult = await controller.submit(req);

          expect(expectedResult).toEqual({
            file: 'something.gov.uk',
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
            async () => await controller.submit(req),
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
          expect(expectedResult).toEqual({
            url: '/ingest/url/success',
          });
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
          req,
          DEFAULT_USER_WITH_REGULATOR,
        );

        expect(expectedResult).toEqual({ id: 'id' });
      });
    });
  });
});
