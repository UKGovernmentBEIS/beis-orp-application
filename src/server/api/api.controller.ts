import {
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
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
import { AuthGuard } from '../auth/AuthGuard';
import { DocumentRequestDto } from './types/DocumentRequest.dto';
import { DocumentService } from '../document/document.service';
import { FileUpload } from '../data/types/FileUpload';

@UsePipes(new ValidationPipe())
@Controller('api')
export class ApiController {
  constructor(
    private searchService: SearchService,
    private documentService: DocumentService,
  ) {}

  @Get('search')
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
  @UseGuards(AuthGuard)
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
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'pdf' })],
      }),
    )
    file: FileUpload,
  ) {
    await this.documentService.upload(file);
    return 'success';
  }

  @Get('document/:id')
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
}
