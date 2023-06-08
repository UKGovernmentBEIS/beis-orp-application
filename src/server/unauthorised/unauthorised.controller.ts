import {
  Controller,
  Get,
  Param,
  Render,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ViewDataInterceptor } from '../view-data.interceptor';
import { ErrorFilter } from '../error.filter';

@Controller('unauthorised')
@UseInterceptors(ViewDataInterceptor)
@UseFilters(ErrorFilter)
export class UnauthorisedController {
  @Get('/:page')
  @Render('pages/unauthorised')
  index(@Param() { page }: { page: string }) {
    return {
      page,
    };
  }
}
