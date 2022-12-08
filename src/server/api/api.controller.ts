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

@UsePipes(new ValidationPipe())
@Controller('api')
export class ApiController {
  constructor(
    private awsService: AwsService,
    private searchService: SearchService,
  ) {}

  @Get('search')
  search(@Query() searchRequest: SearchRequestDto): Promise<SearchResponseDto> {
    return this.searchService.search(
      searchRequest.title,
      searchRequest.keyword,
    );
  }

  @Put('upload')
  @UseInterceptors(FileInterceptor('file'))
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
