import {
  Controller,
  ForbiddenException,
  Get,
  Header,
  Param,
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
  ): Promise<{ document: OrpSearchItem }> {
    const document = await this.documentService.getDocumentById(id);
    if (document.creator !== user.regulator.name) {
      throw new ForbiddenException();
    }
    return { document };
  }
}
