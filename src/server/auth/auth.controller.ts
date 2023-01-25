import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Request,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthRegisterDto from './types/AuthRegister.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { ErrorFilter } from '../error.filter';
import { AuthExceptionFilter } from './filters/authException.filter';
import { ApiKeyGuard } from './apiKey.guard';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';

@UsePipes(new ValidationPipe())
@UseFilters(new AuthExceptionFilter())
@UseFilters(new ErrorFilter())
@UseInterceptors(ViewDataInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(ApiKeyGuard)
  @Post('/register')
  register(@Body() authRegisterDto: AuthRegisterDto) {
    return this.authService.registerUser(authRegisterDto);
  }
  @Get('login')
  @Render('pages/auth/login')
  login() {
    return;
  }
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @Redirect('/search')
  loginPost(@Request() req) {
    return req.user;
  }

  @Get('/logout')
  @Redirect('/auth/login')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
