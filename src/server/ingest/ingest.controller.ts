import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Header,
  ParseFilePipe,
  Post,
  Query,
  Redirect,
  Render,
  Request,
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
import IngestHtmlDto from './types/IngestHtml.dto';
import IngestDeviceDto from './types/IngestDevice.dto';
import { RegulatorGuard } from '../auth/regulator.guard';
import { UserCollectedUrlUploadData } from '../data/types/UrlUpload';
import { getTopicsForView } from './utils/topics';

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
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/upload')
  upload() {
    return {};
  }

  @Post('upload')
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
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() ingestDeviceDto: IngestDeviceDto,
    @User() user: UserType,
  ) {
    const { key } = await this.documentService.upload(file, user, true);
    return { url: `/ingest/document-type?key=${key}` };
  }

  @Post('ingest-html')
  @Redirect('/ingest/document-topics', 302)
  @ValidateForm('/ingest/upload')
  async ingestHtml(@Body() ingestHtmlDto: IngestHtmlDto, @Request() req) {
    const { url } = ingestHtmlDto;
    req.session.urlIngestion = {
      uri: url,
    };

    return { url: `/ingest/document-type?key=url` };
  }

  @Get('document-type')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/documentType')
  async chooseDocType(@Query() { key }: { key: string }, @Request() req) {
    if (key === 'url') {
      const data = req.session.urlIngestion;
      if (!data?.uri) throw new Error('No url ingestion data');
      return {
        key,
        documentTypes,
        selected: data.document_type,
      };
    }

    const meta = await this.documentService.getDocumentMeta(key);
    return {
      key,
      documentTypes,
      selected: meta.document_type,
    };
  }

  @Post('document-type')
  @Redirect('/ingest/document-topics', 302)
  @ValidateForm()
  async postDocType(@Body() documentTypeDto: DocumentTypeDto, @Request() req) {
    const { key, documentType } = documentTypeDto;

    if (key === 'url') {
      req.session.urlIngestion = {
        ...req.session.urlIngestion,
        document_type: documentType,
      };

      return { url: '/ingest/document-topics?key=url' };
    }

    await this.documentService.updateMeta(key, {
      document_type: documentType,
    });

    return { url: `/ingest/document-topics?key=${key}` };
  }

  @Get('document-topics')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/documentTopics')
  async tagTopics(@Query() { key }: { key: string }, @Request() req) {
    if (key === 'url') {
      const data = req.session.urlIngestion;
      if (!data?.uri) throw new Error('No url ingestion data');
    }

    const meta =
      key === 'url'
        ? req.session.urlIngestion
        : await this.documentService.getDocumentMeta(key);

    const { selectedTopics, topicsForSelections } = getTopicsForView(
      meta.topics ?? [],
    );

    return {
      key,
      topicsForSelections: [Object.keys(topics), ...topicsForSelections],
      topicsDisplayMap,
      selectedTopics,
    };
  }

  @Post('document-topics')
  @Redirect('/ingest/document-status', 302)
  async postTagTopics(
    @Body() documentTopicsDto: DocumentTopicsDto,
    @Request() req,
  ) {
    const { key, topic1, topic2, topic3, topic4, topic5 } = documentTopicsDto;
    const topics = [topic1, topic2, topic3, topic4, topic5].filter(
      (topic) => topic,
    );

    if (key === 'url') {
      req.session.urlIngestion = {
        ...req.session.urlIngestion,
        topics,
      };
    } else {
      await this.documentService.updateMeta(key, {
        topics: JSON.stringify(topics),
      });
    }

    return { url: `/ingest/document-status?key=${key}` };
  }

  @Get('document-status')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/documentStatus')
  async chooseDraft(@Query() { key }: { key: string }, @Request() req) {
    if (key === 'url') {
      const url = req.session.urlIngestion?.uri;
      if (!url) throw new Error('No url ingestion data');
    }
    const meta =
      key === 'url'
        ? req.session.urlIngestion
        : await this.documentService.getDocumentMeta(key);

    return {
      key,
      selected: meta.status,
    };
  }

  @Post('document-status')
  @Redirect('/ingest/submit', 302)
  @ValidateForm()
  async postDraft(
    @Body() documentStatusDto: DocumentStatusDto,
    @Request() req,
  ) {
    const { key, status } = documentStatusDto;

    if (key === 'url') {
      req.session.urlIngestion = {
        ...req.session.urlIngestion,
        status,
      };
    } else {
      await this.documentService.updateMeta(key, {
        status,
      });
    }

    return { url: `/ingest/submit?key=${key}` };
  }

  @Get('submit')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/submit')
  async submit(@Query() { key }: { key: string }, @Request() req) {
    if (key === 'url') {
      const url = req.session.urlIngestion?.uri;
      if (!url) throw new Error('No url ingestion data');

      const meta = req.session.urlIngestion;
      const selectedTopics = meta.topics;

      return {
        key,
        file: meta.uri,
        documentType: documentTypes[meta.document_type] ?? 'Other',
        documentStatus: orpDocumentStatus[meta.status] ?? '',
        documentTopics: selectedTopics.map((id) => topicsDisplayMap[id]) ?? [],
        documentFormat: 'url',
      };
    }

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
  async submitPost(
    @Body() { key }: { key: string },
    @Request() req,
    @User() user: UserType,
  ) {
    if (key === 'url') {
      const uuid = await this.documentService.ingestUrl(
        req.session.urlIngestion as UserCollectedUrlUploadData,
        user,
      );
      req.session.urlIngestion = {
        ...req.session.urlIngestion,
        uuid,
      };
      return { url: `/ingest/success?key=${key}` };
    }

    const newKey = await this.documentService.confirmDocument(key);
    return { url: `/ingest/success?key=${newKey}` };
  }

  @Get('success')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/success')
  async success(@Query() { key }: { key: string }, @Request() req) {
    const meta =
      key === 'url'
        ? req.session.urlIngestion
        : await this.documentService.getDocumentMeta(key);
    return { id: meta.uuid };
  }
}
