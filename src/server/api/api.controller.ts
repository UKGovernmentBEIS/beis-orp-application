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
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
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
import { ApiSearchResponseDto } from './types/ApiSearchResponse.dto';
import * as snakecaseKeys from 'snakecase-keys';
import ApiTokensDto from './types/ApiTokensDto';
import ApiRefreshTokensDto from './types/ApiRefreshTokensDto';
import { LinkedDocumentsRequestDto } from './types/LinkedDocumentsRequest.dto';
import { ApiLinkedDocumentsResponseDto } from './types/ApiLinkedDocumentsResponse.dto';
import { User } from '../user/user.decorator';
import { ApiUser as UserType } from '../auth/types/User';

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
  @ApiTags('document')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Document to be ingested', type: FileUploadDto })
  @ApiOkResponse({ description: 'The document has been uploaded' })
  @ApiBadRequestResponse({
    description: 'Bad request. multipart/form-data must include a pdf file',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  async uploadFile(
    @User() user: UserType,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'pdf' })],
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
  @ApiTags('document')
  @ApiOkResponse({
    description: 'Returns the document in PDF format',
    schema: { type: 'string', format: 'binary' },
  })
  @ApiNotFoundResponse({ description: 'The requested document was not found' })
  async getDocument(
    @Param() params: DocumentRequestDto,
  ): Promise<StreamableFile> {
    return new StreamableFile(
      await this.documentService.getDocument(params.id),
    );
  }

  @Post('tokens')
  @ApiTags('auth')
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
