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
import toApiSearchResult from './utils/toApiSearchResult';
import {
  ApiOrpSearchItem,
  ApiSearchResponseDto,
} from './types/ApiSearchResponse.dto';
import * as snakecaseKeys from 'snakecase-keys';
import ApiTokensDto from './types/ApiTokensDto';
import ApiRefreshTokensDto from './types/ApiRefreshTokensDto';
import { LinkedDocumentsRequestDto } from './types/LinkedDocumentsRequest.dto';
import { ApiLinkedDocumentsResponseDto } from './types/ApiLinkedDocumentsResponse.dto';
import { User } from '../user/user.decorator';
import { ApiUser as UserType } from '../auth/types/User';
import { acceptedMimeTypesRegex } from '../document/utils/mimeTypes';
import ApiFileValidationExceptionFactory from './utils/ApiFileValidationExceptionFactory';
import { ThrottlerGuard } from '@nestjs/throttler';

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
  async search(
    @Query() apiSearchRequest: ApiSearchRequestDto,
  ): Promise<ApiSearchResponseDto> {
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
  @ApiNotFoundResponse({ description: 'The requested document was not found' })
  async getDocument(
    @Param() { id }: DocumentRequestDto,
  ): Promise<ApiOrpSearchItem> {
    const document = await this.documentService.getDocumentById(id);
    return snakecaseKeys(document);
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
  async login(
    @Body() { client_id, client_secret }: ApiTokenRequestDto,
  ): Promise<ApiTokensDto> {
    return snakecaseKeys(
      await this.apiAuthService.authenticateApiClient({
        clientId: client_id,
        clientSecret: client_secret,
      }),
    );
  }

  @Post('refresh-tokens')
  @ApiTags('auth')
  async refreshToken(
    @Body() apiRefreshTokenRequestDto: ApiRefreshTokenRequestDto,
  ): Promise<ApiRefreshTokensDto> {
    return snakecaseKeys(
      await this.apiAuthService.refreshApiUser(apiRefreshTokenRequestDto.token),
    );
  }

  @Post('linked-documents')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get documents from the ORP that are linked to a piece of legislation',
  })
  @ApiTags('search')
  @HttpCode(200)
  async getLinkedDocuments(
    @Body() linkedDocumentsRequestDto: LinkedDocumentsRequestDto,
  ): Promise<ApiLinkedDocumentsResponseDto> {
    const result = await this.searchService.getLinkedDocuments(
      linkedDocumentsRequestDto,
    );
    return snakecaseKeys(result) as unknown as ApiLinkedDocumentsResponseDto;
  }
}
