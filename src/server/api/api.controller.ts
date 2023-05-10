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
import { ApiSearchRequestDto } from './types/ApiSearchRequest.dto';
import { SearchService } from '../search/search.service';
import { FileUploadDto } from './types/FileUpload.dto';
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
import { DocumentRequestDto } from './types/DocumentRequest.dto';
import { DocumentService } from '../document/document.service';
import { FileUpload } from '../data/types/FileUpload';
import JwtAuthenticationGuard from '../auth/jwt.guard';
import JwtRegulatorGuard from '../auth/jwt-regulator.guard';
import { ApiAuthService } from '../auth/api-auth.service';
import ApiTokenRequestDto from './types/ApiTokenRequest.dto';
import ApiRefreshTokenRequestDto from './types/ApiRefreshTokenRequest.dto';
import toSearchRequest from './utils/toSearchRequest';
import toApiSearchResult, {
  FilteredOrpSearchItemForApi,
  FilteredSearchResponseForApi,
  toApiOrpDocument,
} from './utils/toApiSearchResult';
import {
  ApiOrpSearchItem,
  ApiSearchResponseDto,
} from './types/ApiSearchResponse.dto';
import ApiTokensDto from './types/ApiTokensDto';
import ApiRefreshTokensDto from './types/ApiRefreshTokensDto';
import { LinkedDocumentsRequestDto } from './types/LinkedDocumentsRequest.dto';
import { User } from '../user/user.decorator';
import { ApiUser as UserType } from '../auth/types/User';
import { acceptedMimeTypesRegex } from '../document/utils/mimeTypes';
import ApiFileValidationExceptionFactory from './utils/ApiFileValidationExceptionFactory';
import { ThrottlerGuard } from '@nestjs/throttler';
import FileNotEmptyValidator from '../form-validation/FileNotEmptyValidator';
import { LinkedDocumentsResponseDto } from '../search/types/LinkedDocumentsResponse.dto';
import { SnakeCaseInterceptor } from './utils/snake-case.interceptor';
import { ApiLinkedDocumentsResponseDto } from './types/ApiLinkedDocumentsResponse.dto';
import { CognitoRefreshResponse } from '../auth/types/CognitoRefreshResponse.dto';
import { CognitoAuthResponse } from '../auth/types/CognitoAuthResponse';

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
    @Body() { client_id, client_secret }: ApiTokenRequestDto,
  ): Promise<CognitoAuthResponse['AuthenticationResult']> {
    return this.apiAuthService.authenticateApiClient({
      clientId: client_id,
      clientSecret: client_secret,
    });
  }

  @Post('refresh-tokens')
  @ApiTags('auth')
  @ApiOkResponse({ type: ApiRefreshTokensDto })
  @UseInterceptors(SnakeCaseInterceptor)
  async refreshToken(
    @Body() apiRefreshTokenRequestDto: ApiRefreshTokenRequestDto,
  ): Promise<CognitoRefreshResponse['AuthenticationResult']> {
    return this.apiAuthService.refreshApiUser(apiRefreshTokenRequestDto.token);
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
