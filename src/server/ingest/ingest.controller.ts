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
import { User } from '../user/user.decorator';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';
import { ValidateForm } from '../form-validation';
import type { User as UserType } from '../auth/types/User';
import { documentTypes } from '../search/types/documentTypes';
import DocumentTypeDto from './types/DocumentType.dto';
import DocumentStatusDto from './types/DocumentStatus.dto';
import { orpDocumentStatus } from '../search/types/statusTypes';
import { acceptedMimeTypesRegex } from '../document/utils/mimeTypes';
import { topics } from '../document/utils/topics';
import { topicsDisplayMap } from '../document/utils/topics-display-mapping';
import DocumentTopicsDto from './types/DocumentTopics.dto';
import * as R from 'ramda';
import { RegulatorGuard } from '../auth/regulator.guard';

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
  @Redirect('/ingest/document-topics', 302)
  @ValidateForm()
  async postDocType(@Body() documentTypeDto: DocumentTypeDto) {
    const { key, documentType } = documentTypeDto;
    await this.documentService.updateMeta(key, { document_type: documentType });

    return { url: `/ingest/document-topics?key=${key}` };
  }

  @Get('document-topics')
  @Render('pages/ingest/documentTopics')
  async tagTopics(@Query() { key }: { key: string }) {
    const meta = await this.documentService.getDocumentMeta(key);
    const selectedTopics: string[] = meta.topics?.length
      ? JSON.parse(meta.topics)
      : [];

    const topicsForSelections = selectedTopics
      .map<string[]>((topicId, index) => {
        const idPath = selectedTopics.slice(0, index + 1);
        return R.keys(R.path(idPath, topics));
      })
      .filter((list) => list.length);

    return {
      key,
      topicsForSelections: [Object.keys(topics), ...topicsForSelections],
      topicsDisplayMap,
      selectedTopics,
    };
  }

  @Post('document-topics')
  @Redirect('/ingest/document-status', 302)
  async postTagTopics(@Body() documentTopicsDto: DocumentTopicsDto) {
    const { key, topic1, topic2, topic3, topic4, topic5 } = documentTopicsDto;
    await this.documentService.updateMeta(key, {
      topics: JSON.stringify(
        [topic1, topic2, topic3, topic4, topic5].filter((topic) => topic),
      ),
    });

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
    const selectedTopics: string[] = meta.topics?.length
      ? JSON.parse(meta.topics)
      : [];

    return {
      key,
      file: meta.file_name,
      documentType: documentTypes[meta.document_type] ?? 'Other',
      documentStatus: orpDocumentStatus[meta.status] ?? '',
      documentTopics: selectedTopics.map((id) => topicsDisplayMap[id]) ?? [],
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
