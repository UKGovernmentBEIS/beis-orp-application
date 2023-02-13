import {
  Controller,
  Get,
  Render,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';
import { User } from './user.decorator';
import { User as UserType } from '../auth/types/User';

@Controller('user')
@UseInterceptors(ViewDataInterceptor)
export class UserController {
  @Get('')
  @UseGuards(AuthenticatedGuard)
  @Render('pages/user/')
  userDetails(@User() user: UserType) {
    return user;
  }
}
