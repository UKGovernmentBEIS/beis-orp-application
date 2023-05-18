import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  Param,
  Post,
  Redirect,
  Render,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegulatorGuard } from '../auth/regulator.guard';
import { UploadedDocumentsService } from './uploaded-documents.service';
import { User } from '../user/user.decorator';
import { User as UserType } from '../auth/types/User';
import {
  OrpSearchItem,
  OrpSearchResponse,
} from '../search/types/SearchResponse.dto';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';
import { ErrorFilter } from '../error.filter';
import { DocumentService } from '../document/document.service';
import { DocumentType, documentTypes } from '../search/types/documentTypes';
import { ValidateForm } from '../form-validation';
import DocumentTypeDto from '../ingest/types/DocumentType.dto';
import {
  getTopicsForView,
  getTopicValuesFromNames,
} from '../ingest/utils/topics';
import { topics } from '../document/utils/topics';
import { topicsDisplayMap } from '../document/utils/topics-display-mapping';
import DocumentTopicsDto from '../ingest/types/DocumentTopics.dto';
import DocumentStatusDto from '../ingest/types/DocumentStatus.dto';

@Controller('uploaded-documents')
@UseGuards(RegulatorGuard)
@UseInterceptors(ViewDataInterceptor)
@UseFilters(ErrorFilter)
export class UploadedDocumentsController {
  constructor(
    private uploadedDocumentsService: UploadedDocumentsService,
    private documentService: DocumentService,
  ) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @Render('pages/uploadedDocuments')
  async findAll(@User() user: UserType): Promise<OrpSearchResponse> {
    return this.uploadedDocumentsService.findAll(user);
  }

  @Get('/detail/:id')
  @Render('pages/uploadedDocuments/document')
  async getDocumentDetails(
    @Param() { id }: { id: string },
    @User() user: UserType,
  ): Promise<{ document: OrpSearchItem; title: string }> {
    const document = await this.documentService.getDocumentById(id);
    if (document.regulatorId !== user.regulator.id) {
      throw new ForbiddenException();
    }
    return { document, title: `${document.title} details` };
  }

  @Get('/document-type/:id')
  @Render('pages/uploadedDocuments/documentType')
  async getUpdateDocumentType(
    @Param() { id }: { id: string },
    @User() user: UserType,
  ): Promise<{
    key: string;
    selected: DocumentType;
    documentTypes: typeof documentTypes;
    title: string;
    id: string;
  }> {
    const {
      regulatorId,
      uri: key,
      documentTypeId,
    } = await this.documentService.getDocumentById(id);
    if (regulatorId !== user.regulator.id) {
      throw new ForbiddenException();
    }
    return {
      key,
      id,
      selected: documentTypeId,
      documentTypes,
      title: 'Update document type',
    };
  }

  @Post('document-type/:id')
  @Redirect('/uploaded-documents/updated/:id', 302)
  @ValidateForm()
  async postDocType(
    @Body() documentTypeDto: DocumentTypeDto,
    @Param() { id }: { id: string },
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

    return { url: `/uploaded-documents/updated/${id}` };
  }

  @Get('/topics/:id')
  @Render('pages/uploadedDocuments/documentTopics')
  async getUpdateDocumentTopics(
    @Param() { id }: { id: string },
    @User() user: UserType,
  ) {
    const {
      regulatorId,
      uri: key,
      regulatoryTopics,
    } = await this.documentService.getDocumentById(id);
    if (regulatorId !== user.regulator.id) {
      throw new ForbiddenException();
    }

    const { selectedTopics, topicsForSelections } = getTopicsForView(
      getTopicValuesFromNames(regulatoryTopics),
    );
    const topLevelTopics = Object.keys(topics);

    return {
      key,
      id,
      topicsForSelections: [topLevelTopics, ...topicsForSelections],
      topicsDisplayMap,
      selectedTopics,
      title: 'Update document topics',
    };
  }

  @Post('/topics/:id')
  @Redirect('/uploaded-documents/updated/:id')
  @ValidateForm()
  async postTagTopics(
    @Body() documentTopicsDto: DocumentTopicsDto,
    @Param() { id }: { id: string },
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

    return { url: `/uploaded-documents/updated/${id}` };
  }

  @Get('/status/:id')
  @Render('pages/uploadedDocuments/documentStatus')
  async getUpdateDocumentStatus(
    @Param() { id }: { id: string },
    @User() user: UserType,
  ) {
    const {
      regulatorId,
      uri: key,
      status,
    } = await this.documentService.getDocumentById(id);
    if (regulatorId !== user.regulator.id) {
      throw new ForbiddenException();
    }

    return {
      id,
      key,
      selected: status,
      title: 'Update document status',
    };
  }

  @Post('/status/:id')
  @Redirect('/uploaded-documents/updated/:id')
  @ValidateForm()
  async postUpdateDocumentStatus(
    @Body() documentStatusDto: DocumentStatusDto,
    @Param() { id }: { id: string },
    @User() user: UserType,
  ) {
    const { key, status } = documentStatusDto;

    await this.documentService.updateMeta(key, { status }, user);

    return { url: `/uploaded-documents/updated/${id}` };
  }

  @Get('updated/:id')
  @Render('pages/uploadedDocuments/documentUpdated')
  success(@Param() { id }: { id: string }) {
    return { documentId: id, title: 'Document successfully updated' };
  }
}
