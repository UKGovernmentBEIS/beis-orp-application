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
import { mockTokens, mockTokensReturn } from '../../../test/mocks/tokens.mock';
import { AuthService } from '../auth/auth.service';

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
        AuthService,
        ApiAuthService,
        RegulatorService,
      ],
      imports: [HttpModule],
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
      const expectedResult = {
        legislation: { total_search_results: 10, documents: [] },
        regulatory_material: { total_search_results: 10, documents: [] },
      };
      jest.spyOn(searchService, 'search').mockResolvedValue(searchResponse);

      const result = await controller.search({
        title: 'title',
        keyword: 'keyword',
      });

      expect(result).toEqual(expectedResult);
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

    it('should call searchService and return response', async () => {
      const buffer = await getPdfBuffer();
      const getDocMock = jest
        .spyOn(documentService, 'getDocument')
        .mockResolvedValue(Readable.from(buffer));

      const result = await controller.getDocument({ id: 'id' });

      expect(getDocMock).toBeCalledWith('id');
      expect(result).toBeInstanceOf(StreamableFile);
    });
  });

  describe('login', () => {
    it('should apply JwtRegulatorGuard', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        ApiController.prototype.getDocument,
      );
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthenticationGuard);
    });

    it('should return response from authService', async () => {
      const buffer = await getPdfBuffer();
      const getDocMock = jest
        .spyOn(documentService, 'getDocument')
        .mockResolvedValue(Readable.from(buffer));

      const result = await controller.getDocument({ id: 'id' });

      expect(getDocMock).toBeCalledWith('id');
      expect(result).toBeInstanceOf(StreamableFile);
    });
  });

  describe('login', () => {
    it('should return response from apiAuthService', async () => {
      const getTokensMock = jest
        .spyOn(apiAuthService, 'authenticateApiClient')
        .mockResolvedValue(mockTokens);

      const creds = {
        client_id: 'clid',
        client_secret: 'cls',
      };
      const result = await controller.login(creds);

      expect(getTokensMock).toBeCalledWith({
        clientId: 'clid',
        clientSecret: 'cls',
      });
      expect(result).toEqual(mockTokensReturn);
    });
  });

  describe('refreshToken', () => {
    it('should return response from apiAuthService', async () => {
      const refreshTokensMock = jest
        .spyOn(apiAuthService, 'refreshApiUser')
        .mockResolvedValue(mockTokens);

      const result = await controller.refreshToken({
        token: mockTokens.RefreshToken,
      });

      expect(refreshTokensMock).toBeCalledWith(mockTokens.RefreshToken);
      expect(result).toEqual(mockTokensReturn);
    });
  });
});
