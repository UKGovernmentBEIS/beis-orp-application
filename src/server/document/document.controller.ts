import {
  Controller,
  Get,
  Param,
  Query,
  Render,
  StreamableFile,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { documentTypes } from '../search/types/documentTypes';
import { SearchService } from '../search/search.service';
import { OrpSearchItem } from '../search/types/SearchResponse.dto';
import TnaDocMeta from './types/TnaDocMeta';
import { Regulator } from '../regulator/types/Regulator';
import regulators from '../regulator/config/regulators';
import { ErrorFilter } from '../error.filter';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';
import { LinkedDocuments } from '../search/types/LinkedDocumentsResponse.dto';
import { LinkedDocumentQueryDto } from './types/LinkedDocumentQuery.dto';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly searchService: SearchService,
  ) {}
  @Get('/view/:id')
  @UseFilters(ErrorFilter)
  @UseInterceptors(ViewDataInterceptor)
  @Render('pages/document')
  async getDocument(
    @Param() { id }: { id: string },
    @Query() { ingested }: { ingested?: string },
  ): Promise<{
    document: OrpSearchItem;
    url: string;
    regulator: Regulator;
    docType: string;
    documentFormat: string;
    ingested: boolean;
    title: string;
  }> {
    const document = await this.documentService.getDocumentById(id);
    const { url, documentFormat } =
      document.documentFormat !== 'HTML'
        ? await this.documentService.getDocumentUrl(document.uri)
        : { url: null, documentFormat: 'HTML' };
    const regulator = regulators.find((reg) => reg.name === document.creator);
    const docType = documentTypes[document.documentType] ?? '';

    return {
      document,
      url,
      documentFormat,
      regulator,
      docType,
      ingested: ingested === 'true',
      title: `Document details for ${document.title}`,
    };
  }

  @Get('/download/:id')
  async downloadDocument(
    @Param() params: { id: string },
  ): Promise<StreamableFile> {
    return new StreamableFile(
      await this.documentService.getDocumentStream(params.id),
    );
  }
  @UseFilters(ErrorFilter)
  @UseInterceptors(ViewDataInterceptor)
  @Get('/linked-documents')
  @Render('pages/document/linkedDocuments')
  @UsePipes(ValidationPipe)
  async getLinkedDocuments(
    @Query() { id, published }: LinkedDocumentQueryDto,
  ): Promise<{
    documentData: TnaDocMeta;
    linkedDocuments: LinkedDocuments['relatedDocuments'];
    href: string;
    publishedDate: string;
  }> {
    const documentData = await this.documentService.getTnaDocument(id);
    const { documents } = await this.searchService.getLinkedDocuments({
      legislation_href: id,
    });

    return {
      href: id,
      documentData,
      linkedDocuments: documents?.[0]?.relatedDocuments || [],
      publishedDate: published,
    };
  }
}
