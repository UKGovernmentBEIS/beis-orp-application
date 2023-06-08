import {
  Controller,
  Get,
  Header,
  Render,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { ViewDataInterceptor } from '../view-data.interceptor';
import { User } from './user.decorator';
import { User as UserType } from '../auth/entities/user';

@Controller('user')
@UseInterceptors(ViewDataInterceptor)
export class UserController {
  @Get('')
  @Header('Cache-Control', 'no-store')
  @UseGuards(AuthenticatedGuard)
  @Render('pages/user/')
  userDetails(@User() user: UserType) {
    return user;
  }
}
