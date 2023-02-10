import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SearchRequestDto } from './types/SearchRequest.dto';
import { SearchService } from '../search/search.service';
import { SearchResponseDto } from './types/SearchResponse.dto';
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
import { Request } from 'express';
import JwtAuthenticationGuard from '../auth/jwt.guard';
import JwtRegulatorGuard from '../auth/jwt-regulator.guard';
import AuthenticationResultDto from '../auth/types/AuthenticationResult.dto';
import { ApiAuthService } from '../auth/api-auth.service';
import ApiTokenRequestDto from '../auth/types/ApiTokenRequest.dto';
import ApiRefreshTokenRequestDto from '../auth/types/ApiRefreshTokenRequest.dto';
import ApiRefreshTokensResponseDto from '../auth/types/ApiRefreshTokensResponse.dto';

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
  @ApiOkResponse({ type: SearchResponseDto })
  @ApiBadRequestResponse({
    description:
      'Bad request. Request must include a query parameter for at least one of title or keyword',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error' })
  search(@Query() searchRequest: SearchRequestDto): Promise<SearchResponseDto> {
    return this.searchService.search(
      searchRequest.title,
      searchRequest.keyword,
    );
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
    @Req() request: Request & { regulator: string },
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'pdf' })],
      }),
    )
    file: FileUpload,
  ) {
    await this.documentService.upload(file, request.regulator);
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
    @Body() apiTokenRequestDto: ApiTokenRequestDto,
  ): Promise<AuthenticationResultDto> {
    return this.apiAuthService.authenticateApiClient(apiTokenRequestDto);
  }

  @Post('refresh-tokens')
  @ApiTags('auth')
  async refreshToken(
    @Body() apiRefreshTokenRequestDto: ApiRefreshTokenRequestDto,
  ): Promise<ApiRefreshTokensResponseDto> {
    return this.apiAuthService.refreshApiUser(apiRefreshTokenRequestDto.token);
  }
}
