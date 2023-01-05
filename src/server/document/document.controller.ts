import { Controller, Get, Param, Render, UseFilters } from '@nestjs/common';
import { DocumentService } from './document.service';
import { ErrorFilter } from '../error.filter';

@UseFilters(new ErrorFilter())
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}
  @Get('/:id')
  @Render('pages/document')
  async getDocument(@Param() params: { id: string }) {
    return this.documentService.getDocumentDetail(params.id);
  }
}
