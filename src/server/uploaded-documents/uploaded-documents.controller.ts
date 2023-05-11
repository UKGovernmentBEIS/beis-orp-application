import {
  Controller,
  Get,
  Header,
  Render,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegulatorGuard } from '../auth/regulator.guard';
import { UploadedDocumentsService } from './uploaded-documents.service';
import { User } from '../user/user.decorator';
import { User as UserType } from '../auth/types/User';
import { OrpSearchResponse } from '../search/types/SearchResponse.dto';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';
import { ErrorFilter } from '../error.filter';

@Controller('uploaded-documents')
@UseGuards(RegulatorGuard)
@UseInterceptors(ViewDataInterceptor)
@UseFilters(ErrorFilter)
export class UploadedDocumentsController {
  constructor(private uploadedDocumentsService: UploadedDocumentsService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @Render('pages/uploadedDocuments')
  async findAll(@User() user: UserType): Promise<OrpSearchResponse> {
    return this.uploadedDocumentsService.findAll(user);
  }
}
