import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import {
  getPdfAsMulterFile,
  getPdfBuffer,
  mockAwsDal,
} from '../../../test/mocks/uploadMocks';
import { SearchService } from '../search/search.service';
import { TnaDal } from '../data/tna.dal';
import { HttpModule } from '@nestjs/axios';
import { mockConfigService } from '../../../test/mocks/config.mock';
import { OrpDal } from '../data/orp.dal';
import { DocumentService } from '../document/document.service';
import { Readable } from 'stream';
import { StreamableFile } from '@nestjs/common';
import { mockLogger } from '../../../test/mocks/logger.mock';
import JwtAuthenticationGuard from '../auth/jwt.guard';
import JwtRegulatorGuard from '../auth/jwt-regulator.guard';
import { ApiAuthService } from '../auth/api-auth.service';
import { RegulatorService } from '../regulator/regulator.service';
import { mockTokens } from '../../../test/mocks/tokens.mock';
import { getMappedOrpDocument } from '../../../test/mocks/orpSearchMock';
import { ThrottlerModule } from '@nestjs/throttler';
import { FULL_TOPIC_PATH } from '../../../test/mocks/topics';
import * as R from 'ramda';
import { OrpSearchMapper } from '../search/utils/orp-search-mapper';
import ApiTokenRequestDto from './entities/api-token-request.dto';
import { OrpmlMapper } from '../document/utils/orpml-mapper';

describe('ApiController', () => {
  let controller: ApiController;
  let documentService: DocumentService;
  let searchService: SearchService;
  let apiAuthService: ApiAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        mockAwsDal,
        SearchService,
        TnaDal,
        OrpDal,
        mockConfigService,
        DocumentService,
        mockLogger,
        ApiAuthService,
        RegulatorService,
        OrpSearchMapper,
        OrpmlMapper,
      ],
      imports: [
        HttpModule,
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 30,
        }),
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    documentService = module.get<DocumentService>(DocumentService);
    searchService = module.get<SearchService>(SearchService);
    apiAuthService = module.get<ApiAuthService>(ApiAuthService);
  });

  describe('upload', () => {
    it('should apply JwtRegulatorGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        ApiController.prototype.uploadFile,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtRegulatorGuard);
    });

    it('should call aws uploader with file', async () => {
      const result = { key: 'file.pdf', id: '123' };
      const docMock = jest
        .spyOn(documentService, 'uploadFromApi')
        .mockResolvedValue(result);

      const file = await getPdfAsMulterFile();
      const apiRegUser = { cognitoUsername: 'cogName', regulator: 'regName' };
      const fileMeta = {
        status: 'published' as const,
        document_type: 'GD' as const,
        file: file,
        topics: FULL_TOPIC_PATH.at(-1),
      };

      const expectedResult = await controller.uploadFile(
        apiRegUser,
        file,
        fileMeta,
      );

      expect(docMock).toBeCalledWith(file, apiRegUser, fileMeta);
      expect(expectedResult).toEqual('success');
    });
  });

  describe('search', () => {
    it('should apply JwtAuthenticationGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        ApiController.prototype.search,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthenticationGuard);
    });

    it('should call searchService and return response', async () => {
      const searchResponse = {
        legislation: { totalSearchResults: 10, documents: [] },
        regulatoryMaterial: { totalSearchResults: 10, documents: [] },
      };

      jest.spyOn(searchService, 'search').mockResolvedValue(searchResponse);

      const result = await controller.search({
        title: 'title',
        keyword: 'keyword',
      });

      expect(result).toEqual(searchResponse);
    });
  });

  describe('getDocument', () => {
    it('should apply JwtAuthenticationGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        ApiController.prototype.getDocument,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthenticationGuard);
    });

    it('should call documentService and return response', async () => {
      const getDocMock = jest
        .spyOn(documentService, 'getDocumentById')
        .mockResolvedValue(getMappedOrpDocument());

      const result = await controller.getDocument({ id: 'id' });

      expect(getDocMock).toBeCalledWith('id');
      expect(result).toEqual(
        R.omit(
          ['uri', 'documentFormat', 'documentTypeId', 'regulatorId'],
          getMappedOrpDocument(),
        ),
      );
    });
  });

  describe('downloadDocument', () => {
    it('should apply JwtRegulatorGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        ApiController.prototype.downloadDocument,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthenticationGuard);
    });

    it('should return response from documentService', async () => {
      const buffer = await getPdfBuffer();
      const getDocMock = jest
        .spyOn(documentService, 'getDocumentStream')
        .mockResolvedValue(Readable.from(buffer));

      const result = await controller.downloadDocument({ id: 'id' });

      expect(getDocMock).toBeCalledWith('id');
      expect(result).toBeInstanceOf(StreamableFile);
    });
  });

  describe('login', () => {
    it('should return response from apiAuthService for grant_type client_credentials', async () => {
      const getTokensMock = jest
        .spyOn(apiAuthService, 'authenticateApiClient')
        .mockResolvedValue(mockTokens);

      const creds = {
        grant_type: 'client_credentials' as ApiTokenRequestDto['grant_type'],
        client_id: 'clid',
        client_secret: 'cls',
      };
      const result = await controller.login(creds);

      expect(getTokensMock).toBeCalledWith({
        clientId: 'clid',
        clientSecret: 'cls',
      });
      expect(result).toEqual(mockTokens);
    });

    it('should return response from apiAuthService for grant_type refresh_token', async () => {
      const refreshTokensMock = jest
        .spyOn(apiAuthService, 'refreshApiUser')
        .mockResolvedValue(mockTokens);

      const result = await controller.login({
        grant_type: 'refresh_token' as ApiTokenRequestDto['grant_type'],
        refresh_token: mockTokens.RefreshToken,
      });

      expect(refreshTokensMock).toBeCalledWith(mockTokens.RefreshToken);
      expect(result).toEqual(mockTokens);
    });
  });
});
