import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Query,
  Redirect,
  Render,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ErrorFilter } from '../error.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import FileValidationExceptionFactory from './utils/FileValidationExceptionFactory';
import { DocumentService } from '../document/document.service';
import { RegulatorGuard } from '../auth/regulator.guard';
import { User } from '../user/user.decorator';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';
import { ValidateForm } from '../form-validation';
import IngestionConfirmationDto from './types/IngestionConfirmation.dto';
import type { User as UserType } from '../auth/types/User';

@Controller('ingest')
@UseGuards(RegulatorGuard)
@UseFilters(ErrorFilter)
@UseInterceptors(ViewDataInterceptor)
export class IngestController {
  constructor(private readonly documentService: DocumentService) {}
  @Get('')
  @Render('pages/ingest/index')
  index() {
    return {};
  }

  @Get('upload')
  @Render('pages/ingest/upload')
  upload() {
    return {};
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @Redirect('/ingest/confirm', 302)
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        exceptionFactory: FileValidationExceptionFactory,
        validators: [new FileTypeValidator({ fileType: 'pdf' })],
      }),
    )
    file: Express.Multer.File,
    @User() user: UserType,
  ) {
    const { key } = await this.documentService.upload(
      file,
      user.regulator.name,
      true,
    );
    return { url: `/ingest/confirm?key=${key}` };
  }

  @Get('confirm')
  @Render('pages/ingest/confirm')
  async confirm(@Query() { key }: { key: string }) {
    return {
      url: await this.documentService.getDocumentUrl(key),
      key,
    };
  }

  @Post('confirm')
  @Redirect('/ingest/submit', 302)
  @ValidateForm()
  async confirmPost(@Body() confirmDto: IngestionConfirmationDto) {
    const { confirm, key } = confirmDto;

    if (confirm === 'yes') {
      return { url: `/ingest/submit?key=${key}` };
    }

    await this.documentService.deleteDocument(key);
    return { url: '/ingest/upload' };
  }

  @Get('submit')
  @Render('pages/ingest/submit')
  async submit(@Query() { key }: { key: string }) {
    const meta = await this.documentService.getDocumentMeta(key);
    return { key, file: meta.filename };
  }

  @Post('submit')
  @Redirect('/ingest/success')
  async submitPost(@Body() { key }: { key: string }) {
    const newKey = await this.documentService.confirmDocument(key);
    return { url: `/ingest/success?key=${newKey}` };
  }

  @Get('success')
  @Render('pages/ingest/success')
  async success(@Query() { key }: { key: string }) {
    const meta = await this.documentService.getDocumentMeta(key);
    return { id: meta.uuid };
  }
}
