import {
  Controller,
  Get,
  Param,
  Render,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { ErrorFilter } from '../error.filter';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';
import { RawOrpResponseEntry } from '../data/types/rawOrpSearchResponse';
import { RegulatorService } from '../regulator/regulator.service';
import { Regulator } from '@prisma/client';

@UseFilters(ErrorFilter)
@UseInterceptors(ViewDataInterceptor)
@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly regulatorService: RegulatorService,
  ) {}
  @Get('/:id')
  @Render('pages/document')
  async getDocument(@Param() params: { id: string }): Promise<{
    document: RawOrpResponseEntry;
    url: string;
    regulator: Regulator;
  }> {
    const orpDoc = await this.documentService.getDocumentDetail(params.id);
    const regulator = await this.regulatorService.getRegulatorById(
      orpDoc.document.regulator_id,
    );
    return {
      ...orpDoc,
      regulator,
    };
  }
}
