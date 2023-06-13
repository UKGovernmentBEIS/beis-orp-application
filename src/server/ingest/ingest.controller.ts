import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Redirect,
  Render,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ErrorFilter } from '../error.filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { ViewDataInterceptor } from '../view-data.interceptor';
import { ValidateForm } from '../form-validation';
import IngestDeviceDto from './entities/ingest-device.dto';
import { RegulatorGuard } from '../auth/regulator.guard';

//TODO refactor class to separate html functionality from document
@Controller('ingest')
@UseGuards(RegulatorGuard)
@UseFilters(ErrorFilter)
@UseInterceptors(ViewDataInterceptor)
export class IngestController {
  @Get('')
  @Render('pages/ingest/index')
  index() {
    return {};
  }

  @Get('upload')
  @Header('Cache-Control', 'no-store')
  @Render('pages/ingest/uploadType')
  upload() {
    return {};
  }

  @Post('upload')
  @ValidateForm()
  @UseInterceptors(FileInterceptor('file'))
  @Redirect('/upload/document', 302)
  async postUploadType(@Body() { uploadType }: IngestDeviceDto) {
    const url = uploadType === 'device' ? '/ingest/document' : '/ingest/url';
    return { url };
  }
}
