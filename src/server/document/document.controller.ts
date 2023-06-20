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
import { documentTypes } from '../search/entities/document-types';
import { SearchService } from '../search/search.service';
import { OrpSearchItem } from '../search/entities/search-response.dto';
import TnaDocMeta from './entities/tna-doc-meta';
import { Regulator } from '../regulator/entities/regulator';
import { ErrorFilter } from '../error.filter';
import { ViewDataInterceptor } from '../view-data.interceptor';
import { LinkedDocuments } from '../search/entities/linked-documents-response.dto';
import { LinkedDocumentQueryDto } from './entities/linked-document-query.dto';
import { RegulatorService } from '../regulator/regulator.service';
import { OrpmlMeta } from './entities/orpml-meta';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly searchService: SearchService,
    private readonly regulatorService: RegulatorService,
  ) {}
  @Get('/view/:id')
  @UseFilters(ErrorFilter)
  @UseInterceptors(ViewDataInterceptor)
  @Render('pages/document')
  async getDocument(
    @Param() { id }: { id: string },
    @Query() { ingested, referrer }: { ingested?: string; referrer?: string },
  ): Promise<{
    document: OrpSearchItem;
    url: string;
    regulator: Regulator;
    docType: string;
    documentFormat: string;
    ingested: boolean;
    title: string;
    referrer?: string;
    meta: OrpmlMeta | Record<string, never>;
    content: string;
  }> {
    const document = await this.documentService.getDocumentById(id);
    const orpml = await this.documentService.getOrpml(id);

    const { url, documentFormat } =
      document.documentFormat !== 'HTML' && !orpml
        ? await this.documentService.getDocumentUrl(document.uri)
        : { url: null, documentFormat: orpml ? 'ORPML' : 'HTML' };

    const regulator = this.regulatorService.getRegulatorByName(
      document.creator,
    );
    const docType = documentTypes[document.documentType] ?? '';

    return {
      document,
      url,
      documentFormat,
      regulator,
      docType,
      ingested: ingested === 'true',
      title: `Document details for ${document.title}`,
      referrer,
      meta: orpml?.meta ?? {},
      content: orpml?.content ?? '',
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
