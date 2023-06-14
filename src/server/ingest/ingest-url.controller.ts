import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  Post,
  Redirect,
  Render,
  Request,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ErrorFilter } from '../error.filter';
import { DocumentService } from '../document/document.service';
import { User } from '../user/user.decorator';
import { ViewDataInterceptor } from '../view-data.interceptor';
import { ValidateForm } from '../form-validation';
import type { User as UserType } from '../auth/entities/user';
import { documentTypes } from '../search/entities/document-types';
import DocumentTypeDto from './entities/document-type.dto';
import DocumentStatusDto from './entities/document-status.dto';
import { orpDocumentStatus } from '../search/entities/status-types';
import { topics } from '../document/utils/topics';
import { topicsDisplayMap } from '../document/utils/topics-display-mapping';
import DocumentTopicsDto from './entities/document-topics.dto';
import IngestHtmlDto from './entities/ingest-html.dto';
import { RegulatorGuard } from '../auth/regulator.guard';
import { UserCollectedUrlUploadData } from '../data/entities/url-upload';
import { getTopicsForView } from './utils/topics';
import { Audit } from '../audit.interceptor';

@Controller('ingest/url')
@UseGuards(RegulatorGuard)
@UseFilters(ErrorFilter)
@UseInterceptors(ViewDataInterceptor)
export class IngestUrlController {
  constructor(private readonly documentService: DocumentService) {}
  @Get()
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/uploadUrl')
  upload() {
    return {};
  }

  @Post('')
  @Redirect('/ingest/url/document-type', 302)
  @ValidateForm()
  async ingestHtml(@Body() ingestHtmlDto: IngestHtmlDto, @Request() req) {
    const { url } = ingestHtmlDto;
    req.session.urlIngestion = { uri: url };

    return { url: '/ingest/url/document-type' };
  }

  @Get('document-type')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/documentType')
  async chooseDocType(@Request() req) {
    const data = req.session.urlIngestion;
    if (!data?.uri) throw new Error('No url ingestion data');
    return {
      documentTypes,
      selected: data.document_type,
    };
  }

  @Post('document-type')
  @Redirect('/ingest/url/document-topics', 302)
  @ValidateForm()
  async postDocType(@Body() documentTypeDto: DocumentTypeDto, @Request() req) {
    const { documentType } = documentTypeDto;

    req.session.urlIngestion = {
      ...req.session.urlIngestion,
      document_type: documentType,
    };

    return { url: '/ingest/url/document-topics' };
  }

  @Get('document-topics')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/documentTopics')
  async tagTopics(@Request() req, @User() user: UserType) {
    const data = req.session.urlIngestion;
    if (!data?.uri) throw new Error('No url ingestion data');

    const meta = req.session.urlIngestion;

    if (meta.regulator_id && meta.regulator_id !== user.regulator.id) {
      throw new ForbiddenException();
    }

    const { selectedTopics, topicsForSelections } = getTopicsForView(
      meta.topics ?? [],
    );
    const topLevelTopics = Object.keys(topics);

    return {
      topicsForSelections: [topLevelTopics, ...topicsForSelections],
      topicsDisplayMap,
      selectedTopics,
    };
  }

  @Post('document-topics')
  @Redirect('/ingest/url/document-status', 302)
  async postTagTopics(
    @Body() documentTopicsDto: DocumentTopicsDto,
    @Request() req,
  ) {
    const { topic1, topic2, topic3, topic4, topic5 } = documentTopicsDto;
    const topics = [topic1, topic2, topic3, topic4, topic5].filter(
      (topic) => topic,
    );

    req.session.urlIngestion = {
      ...req.session.urlIngestion,
      topics,
    };

    return { url: '/ingest/url/document-status' };
  }

  @Get('document-status')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/documentStatus')
  async chooseDraft(@Request() req, @User() user: UserType) {
    const url = req.session.urlIngestion?.uri;
    if (!url) throw new Error('No url ingestion data');
    const meta = req.session.urlIngestion;

    if (meta.regulator_id && meta.regulator_id !== user.regulator.id) {
      throw new ForbiddenException();
    }

    return {
      selected: meta.status,
    };
  }

  @Post('document-status')
  @Redirect('/ingest/url/submit', 302)
  @ValidateForm()
  async postDraft(
    @Body() documentStatusDto: DocumentStatusDto,
    @Request() req,
  ) {
    const { status } = documentStatusDto;

    req.session.urlIngestion = {
      ...req.session.urlIngestion,
      status,
    };

    return { url: `/ingest/url/submit` };
  }

  @Get('submit')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/submit')
  async submit(@Request() req) {
    const url = req.session.urlIngestion?.uri;
    if (!url) throw new Error('No url ingestion data');

    const meta = req.session.urlIngestion;
    const selectedTopics = meta.topics;

    return {
      file: meta.uri,
      documentType: documentTypes[meta.document_type] ?? 'Other',
      documentStatus: orpDocumentStatus[meta.status] ?? '',
      documentTopics: selectedTopics.map((id) => topicsDisplayMap[id]) ?? [],
      documentFormat: 'url',
    };
  }

  @Post('submit')
  @Redirect('/ingest/url/success')
  @Audit('URL_UPLOAD', 'uri')
  async submitPost(@Request() req, @User() user: UserType) {
    const uuid = await this.documentService.ingestUrl(
      req.session.urlIngestion as UserCollectedUrlUploadData,
      user,
    );
    req.session.urlIngestion = {
      ...req.session.urlIngestion,
      uuid,
    };
    return { url: `/ingest/url/success`, uri: req.session.urlIngestion.uri };
  }

  @Get('success')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/success')
  async success(@Request() req, @User() user: UserType) {
    const meta = req.session.urlIngestion;

    if (meta.regulator_id && meta.regulator_id !== user.regulator.id) {
      throw new ForbiddenException();
    }
    return { id: meta.uuid };
  }
}
