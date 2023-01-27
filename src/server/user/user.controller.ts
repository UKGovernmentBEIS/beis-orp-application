import {
  Controller,
  Get,
  Render,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';

@Controller('user')
@UseInterceptors(ViewDataInterceptor)
export class UserController {
  constructor(private userService: UserService) {}
  @Get('')
  @UseGuards(AuthenticatedGuard)
  @Render('pages/user/')
  userDetails(@Request() req) {
    return this.userService.getUserByEmail(req.user.email);
  }
}
