import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  Param,
  Post,
  Query,
  Redirect,
  Render,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegulatorGuard } from '../auth/regulator.guard';
import { UploadedDocumentsService } from './uploaded-documents.service';
import { User } from '../user/user.decorator';
import { User as UserType } from '../auth/entities/user';
import {
  OrpSearchItem,
  OrpSearchResponse,
} from '../search/entities/search-response.dto';
import { ViewDataInterceptor } from '../view-data.interceptor';
import { ErrorFilter } from '../error.filter';
import { DocumentService } from '../document/document.service';
import { DocumentType, documentTypes } from '../search/entities/document-types';
import { ValidateForm } from '../form-validation';
import DocumentTypeDto from '../ingest/entities/document-type.dto';
import {
  getTopicsForView,
  getTopicValuesFromNames,
} from '../ingest/utils/topics';
import { topics } from '../document/utils/topics';
import { topicsDisplayMap } from '../document/utils/topics-display-mapping';
import DocumentTopicsDto from '../ingest/entities/document-topics.dto';
import DocumentStatusDto from '../ingest/entities/document-status.dto';
import { getPaginationDetails, PaginationDetails } from './utils/pagination';
import DocumentDeleteDto from './entities/document-delete.dto';

@Controller('uploaded-documents')
@UseGuards(RegulatorGuard)
@UseInterceptors(ViewDataInterceptor)
@UseFilters(ErrorFilter)
export class UploadedDocumentsController {
  constructor(
    private uploadedDocumentsService: UploadedDocumentsService,
    private documentService: DocumentService,
  ) {}

  @Get('')
  @Header('Cache-Control', 'no-store')
  @Render('pages/uploadedDocuments')
  async findAll(
    @User() user: UserType,
    @Query() { page }: { page?: number },
  ): Promise<{
    searchResponse: OrpSearchResponse;
    title: string;
    pagination: PaginationDetails;
  }> {
    const pageToUse = page ?? 1;
    const searchResponse = await this.uploadedDocumentsService.findAll(
      user,
      pageToUse - 1,
    );
    const pagination = getPaginationDetails(
      page,
      searchResponse.totalSearchResults,
    );

    return {
      searchResponse,
      title: `Uploaded documents${pagination.titlePostfix}`,
      pagination,
    };
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

  @Get('/delete/:id')
  @Render('pages/uploadedDocuments/delete')
  async delete(@Param() { id }: { id: string }, @User() user: UserType) {
    const {
      regulatorId,
      title,
      dates: { published: publishedDate },
    } = await this.documentService.getDocumentById(id);
    if (regulatorId !== user.regulator.id) {
      throw new ForbiddenException();
    }
    return {
      documentId: id,
      publishedDate,
      documentTitle: title,
      title: `Delete document: ${title}`,
    };
  }

  @Post('/delete')
  @Redirect('/uploaded-documents/deleted')
  @ValidateForm()
  async postDeleteDocument(
    @Body() { id }: DocumentDeleteDto,
    @User() user: UserType,
  ) {
    return this.documentService.deleteDocument(id, user);
  }

  @Get('updated/:id')
  @Render('pages/uploadedDocuments/documentUpdated')
  success(@Param() { id }: { id: string }) {
    return { documentId: id, title: 'Document successfully updated' };
  }

  @Get('deleted')
  @Render('pages/uploadedDocuments/documentDeleted')
  deleted(@Param() { id }: { id: string }) {
    return { documentId: id, title: 'Document deleted' };
  }
}
