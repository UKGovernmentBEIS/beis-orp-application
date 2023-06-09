import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiSearchRequestDto } from './entities/api-search-request.dto';
import { SearchService } from '../search/search.service';
import { FileUploadDto } from './entities/file-upload.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiBadRequestResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { DocumentRequestDto } from './entities/document-request.dto';
import { DocumentService } from '../document/document.service';
import { FileUpload } from '../data/entities/file-upload';
import JwtAuthenticationGuard from '../auth/jwt.guard';
import JwtRegulatorGuard from '../auth/jwt-regulator.guard';
import { ApiAuthService } from '../auth/api-auth.service';
import ApiTokenRequestDto from './entities/api-token-request.dto';
import toSearchRequest from './utils/to-search-request';
import toApiSearchResult, {
  FilteredOrpSearchItemForApi,
  FilteredSearchResponseForApi,
  toApiOrpDocument,
} from './utils/to-api-search-result';
import {
  ApiOrpSearchItem,
  ApiSearchResponseDto,
} from './entities/api-search-response.dto';
import ApiTokensDto from './entities/api-tokens-dto';
import { LinkedDocumentsRequestDto } from './entities/linked-documents-request.dto';
import { User } from '../user/user.decorator';
import { ApiUser as UserType } from '../auth/entities/user';
import { acceptedMimeTypesRegex } from '../document/utils/mime-types';
import ApiFileValidationExceptionFactory from './utils/api-file-validation-exception-factory';
import { ThrottlerGuard } from '@nestjs/throttler';
import FileNotEmptyValidator from '../validators/file-not-empty.validator';
import { LinkedDocumentsResponseDto } from '../search/entities/linked-documents-response.dto';
import { SnakeCaseInterceptor } from './utils/snake-case.interceptor';
import { ApiLinkedDocumentsResponseDto } from './entities/api-linked-documents-response.dto';
import { CognitoAuthResponse } from '../auth/entities/cognito-auth-response';
import { CognitoRefreshResponse } from '../auth/entities/cognito-refresh-response.dto';

@UseGuards(ThrottlerGuard)
@UsePipes(new ValidationPipe())
@Controller('api')
export class ApiController {
  constructor(
    private searchService: SearchService,
    private documentService: DocumentService,
    private apiAuthService: ApiAuthService,
  ) {}

  @Get('search')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Search across the ORP and The National Archives. Not all filters will work for the National Archive search',
  })
  @ApiTags('search')
  @ApiBadRequestResponse({
    description:
      'Bad request. Request must include a query parameter for at least one of title or keyword',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  @ApiOkResponse({ type: ApiSearchResponseDto })
  @UseInterceptors(SnakeCaseInterceptor)
  async search(
    @Query() apiSearchRequest: ApiSearchRequestDto,
  ): Promise<FilteredSearchResponseForApi> {
    const searchResult = await this.searchService.search(
      toSearchRequest(apiSearchRequest),
    );
    return toApiSearchResult(searchResult);
  }

  @Put('upload')
  @UseGuards(JwtRegulatorGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload a document to be incorporated into The ORP',
  })
  @ApiTags('document')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Document to be ingested', type: FileUploadDto })
  @ApiOkResponse({ description: 'The document has been uploaded' })
  @ApiBadRequestResponse({
    description:
      'Bad request. multipart/form-data must include a pdf, microsoft word or open office file',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async uploadFile(
    @User() user: UserType,
    @UploadedFile(
      new ParseFilePipe({
        exceptionFactory: ApiFileValidationExceptionFactory,
        validators: [
          new FileTypeValidator({
            fileType: acceptedMimeTypesRegex,
          }),
          new FileNotEmptyValidator({}),
        ],
      }),
    )
    file: FileUpload,
    @Body() fileMeta: FileUploadDto,
  ) {
    await this.documentService.uploadFromApi(file, user, fileMeta);
    return 'success';
  }

  @Get('document/:id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @ApiTags('document')
  @ApiOperation({
    summary: 'Returns the document meta data for a given id',
  })
  @ApiOkResponse({ type: ApiOrpSearchItem })
  @UseInterceptors(SnakeCaseInterceptor)
  @ApiNotFoundResponse({ description: 'The requested document was not found' })
  async getDocument(
    @Param() { id }: DocumentRequestDto,
  ): Promise<FilteredOrpSearchItemForApi> {
    const document = await this.documentService.getDocumentById(id);
    return toApiOrpDocument(document);
  }

  @Get('document-download/:id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @ApiTags('document')
  @ApiOperation({
    summary: 'Returns the document as a streamable file',
  })
  @ApiOkResponse({
    description: 'Returns the document as a streamable file',
    schema: { type: 'string', format: 'binary' },
  })
  @ApiNotFoundResponse({ description: 'The requested document was not found' })
  async downloadDocument(
    @Param() params: DocumentRequestDto,
  ): Promise<StreamableFile> {
    return new StreamableFile(
      await this.documentService.getDocumentStream(params.id),
    );
  }

  @Post('tokens')
  @ApiTags('auth')
  @ApiOperation({
    summary:
      'Get tokens to enable access to ORP endpoints. API credentials can be generated in the developer portal of the site',
  })
  @ApiOkResponse({ type: ApiTokensDto })
  @UseInterceptors(SnakeCaseInterceptor)
  async login(
    @Body()
    { grant_type, refresh_token, client_id, client_secret }: ApiTokenRequestDto,
  ): Promise<
    | CognitoAuthResponse['AuthenticationResult']
    | CognitoRefreshResponse['AuthenticationResult']
  > {
    if (grant_type === 'refresh_token') {
      return this.apiAuthService.refreshApiUser(refresh_token);
    }

    return this.apiAuthService.authenticateApiClient({
      clientId: client_id,
      clientSecret: client_secret,
    });
  }

  @Post('linked-documents')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get documents from the ORP that are linked to a piece of legislation',
  })
  @ApiOkResponse({ type: ApiLinkedDocumentsResponseDto })
  @ApiTags('search')
  @HttpCode(200)
  @UseInterceptors(SnakeCaseInterceptor)
  async getLinkedDocuments(
    @Body() linkedDocumentsRequestDto: LinkedDocumentsRequestDto,
  ): Promise<LinkedDocumentsResponseDto> {
    return this.searchService.getLinkedDocuments(linkedDocumentsRequestDto);
  }
}
