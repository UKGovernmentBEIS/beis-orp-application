import {
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUpload } from '../aws/types/FileUpload';
import { SearchRequestDto } from './types/SearchRequest.dto';
import { SearchService } from '../search/search.service';
import { SearchResponseDto } from './types/SearchResponse.dto';
import { FileUploadDto } from './types/FileUpload.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiBadRequestResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';

@UsePipes(new ValidationPipe())
@Controller('api')
export class ApiController {
  constructor(
    private awsService: AwsService,
    private searchService: SearchService,
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
  @UseInterceptors(FileInterceptor('file'))
  @ApiTags('ingestion')
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
    await this.awsService.upload(file);
    return 'success';
  }
}
