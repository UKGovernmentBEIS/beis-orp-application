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
import type { User as UserType } from '../auth/types/User';
import { documentTypes } from '../search/types/documentTypes';
import DocumentTypeDto from './types/DocumentType.dto';
import DocumentStatusDto from './types/DocumentStatus.dto';
import { orpDocumentStatus } from '../search/types/statusTypes';
import { acceptedMimeTypesRegex } from '../document/utils/mimeTypes';

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
        validators: [
          new FileTypeValidator({
            fileType: acceptedMimeTypesRegex,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @User() user: UserType,
  ) {
    const { key } = await this.documentService.upload(file, user, true);
    return { url: `/ingest/document-type?key=${key}` };
  }

  @Get('document-type')
  @Render('pages/ingest/documentType')
  async chooseDocType(@Query() { key }: { key: string }) {
    const meta = await this.documentService.getDocumentMeta(key);
    return { key, documentTypes, selected: meta.document_type };
  }

  @Post('document-type')
  @Redirect('/ingest/document-status', 302)
  @ValidateForm()
  async postDocType(@Body() documentTypeDto: DocumentTypeDto) {
    const { key, documentType } = documentTypeDto;
    await this.documentService.updateMeta(key, { document_type: documentType });

    return { url: `/ingest/document-status?key=${key}` };
  }

  @Get('document-status')
  @Render('pages/ingest/documentStatus')
  async chooseDraft(@Query() { key }: { key: string }) {
    const meta = await this.documentService.getDocumentMeta(key);
    return { key, selected: meta.status };
  }

  @Post('document-status')
  @Redirect('/ingest/submit', 302)
  @ValidateForm()
  async postDraft(@Body() documentStatusDto: DocumentStatusDto) {
    const { key, status } = documentStatusDto;
    await this.documentService.updateMeta(key, { status });

    return { url: `/ingest/submit?key=${key}` };
  }

  @Get('submit')
  @Render('pages/ingest/submit')
  async submit(@Query() { key }: { key: string }) {
    const meta = await this.documentService.getDocumentMeta(key);
    const { documentFormat, url } = await this.documentService.getDocumentUrl(
      key,
    );
    console.log(meta.file_name);
    return {
      key,
      file: meta.file_name,
      documentType: documentTypes[meta.document_type] ?? 'Other',
      documentStatus: orpDocumentStatus[meta.status] ?? '',
      url,
      documentFormat,
    };
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
