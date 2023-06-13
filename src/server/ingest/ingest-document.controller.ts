import {
  Body,
  Controller,
  FileTypeValidator,
  ForbiddenException,
  Get,
  Header,
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
import FileValidationExceptionFactory from './utils/file-validation-exception-factory';
import { DocumentService } from '../document/document.service';
import { User } from '../user/user.decorator';
import { ViewDataInterceptor } from '../view-data.interceptor';
import { ValidateForm } from '../form-validation';
import type { User as UserType } from '../auth/entities/user';
import { documentTypes } from '../search/entities/document-types';
import DocumentTypeDto from './entities/document-type.dto';
import DocumentStatusDto from './entities/document-status.dto';
import { orpDocumentStatus } from '../search/entities/status-types';
import { acceptedMimeTypesRegex } from '../document/utils/mime-types';
import { topics } from '../document/utils/topics';
import { topicsDisplayMap } from '../document/utils/topics-display-mapping';
import DocumentTopicsDto from './entities/document-topics.dto';
import { RegulatorGuard } from '../auth/regulator.guard';
import { getTopicsForView } from './utils/topics';
import FileNotEmptyValidator from '../validators/file-not-empty.validator';

@Controller('ingest/document')
@UseGuards(RegulatorGuard)
@UseFilters(ErrorFilter)
@UseInterceptors(ViewDataInterceptor)
export class IngestDocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/uploadDocument')
  upload() {
    return {};
  }

  @Post()
  @ValidateForm()
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
          new FileNotEmptyValidator({}),
        ],
      }),
    )
    file: Express.Multer.File,
    @User() user: UserType,
  ) {
    const { key } = await this.documentService.upload(file, user, true);
    return { url: `/ingest/document/document-type?key=${key}` };
  }

  @Get('document-type')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/documentType')
  async chooseDocType(
    @Query() { key }: { key: string },
    @User() user: UserType,
  ) {
    const meta = await this.documentService.getDocumentMeta(key);
    if (meta.regulator_id !== user.regulator.id) {
      throw new ForbiddenException();
    }

    return {
      key,
      documentTypes,
      selected: meta.document_type,
    };
  }

  @Post('document-type')
  @Redirect('/ingest/document-topics', 302)
  @ValidateForm()
  async postDocType(
    @Body() documentTypeDto: DocumentTypeDto,
    @User() user: UserType,
  ) {
    const { key, documentType } = documentTypeDto;

    await this.documentService.updateMeta(
      key,
      {
        document_type: documentType,
      },
      user,
    );

    return { url: `/ingest/document/document-topics?key=${key}` };
  }

  @Get('document-topics')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/documentTopics')
  async tagTopics(@Query() { key }: { key: string }, @User() user: UserType) {
    const meta = await this.documentService.getDocumentMeta(key);

    if (meta.regulator_id && meta.regulator_id !== user.regulator.id) {
      throw new ForbiddenException();
    }

    const { selectedTopics, topicsForSelections } = getTopicsForView(
      meta.topics ?? [],
    );
    const topLevelTopics = Object.keys(topics);

    return {
      key,
      topicsForSelections: [topLevelTopics, ...topicsForSelections],
      topicsDisplayMap,
      selectedTopics,
    };
  }

  @Post('document-topics')
  @Redirect('/ingest/document/document-status', 302)
  async postTagTopics(
    @Body() documentTopicsDto: DocumentTopicsDto,
    @User() user: UserType,
  ) {
    const { key, topic1, topic2, topic3, topic4, topic5 } = documentTopicsDto;
    const topics = [topic1, topic2, topic3, topic4, topic5].filter(
      (topic) => topic,
    );

    await this.documentService.updateMeta(
      key,
      {
        topics: JSON.stringify(topics),
      },
      user,
    );

    return { url: `/ingest/document/document-status?key=${key}` };
  }

  @Get('document-status')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/documentStatus')
  async chooseDraft(@Query() { key }: { key: string }, @User() user: UserType) {
    const meta = await this.documentService.getDocumentMeta(key);

    if (meta.regulator_id && meta.regulator_id !== user.regulator.id) {
      throw new ForbiddenException();
    }

    return {
      key,
      selected: meta.status,
    };
  }

  @Post('document-status')
  @Redirect('/ingest/document/submit', 302)
  @ValidateForm()
  async postDraft(
    @Body() documentStatusDto: DocumentStatusDto,
    @User() user: UserType,
  ) {
    const { key, status } = documentStatusDto;
    await this.documentService.updateMeta(key, { status }, user);

    return { url: `/ingest/document/submit?key=${key}` };
  }

  @Get('submit')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/submit')
  async submit(@Query() { key }: { key: string }, @User() user: UserType) {
    const meta = await this.documentService.getDocumentMeta(key);
    if (meta.regulator_id !== user.regulator.id) {
      throw new ForbiddenException();
    }
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
  @Redirect('/ingest/document/success')
  async submitPost(@Body() { key }: { key: string }) {
    const newKey = await this.documentService.confirmDocument(key);
    return { url: `/ingest/document/success?key=${newKey}` };
  }

  @Get('success')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/success')
  async success(@Query() { key }: { key: string }, @User() user: UserType) {
    const meta = await this.documentService.getDocumentMeta(key);

    if (meta.regulator_id && meta.regulator_id !== user.regulator.id) {
      throw new ForbiddenException();
    }
    return { id: meta.uuid };
  }
}
