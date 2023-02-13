import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Request,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthRegisterDto from './types/AuthRegister.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { ErrorFilter } from '../error.filter';
import { AuthExceptionFilter } from './filters/authException.filter';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';
import { ValidateForm } from '../form-validation';
import { User } from '../user/user.decorator';
import ConfirmPasswordDto from './types/ConfirmPassword.dto';
import type { User as UserType } from '../auth/types/User';
import { AuthenticatedGuard } from './authenticated.guard';

@UseFilters(AuthExceptionFilter)
@UseFilters(ErrorFilter)
@UseInterceptors(ViewDataInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('register')
  @Render('pages/auth/register')
  register() {
    return;
  }

  @Post('register')
  @ValidateForm()
  @Redirect('/auth/unconfirmed')
  async registerPost(@Body() authRegisterDto: AuthRegisterDto, @Request() req) {
    await this.authService.registerUser(authRegisterDto);
    req.session.unconfirmedEmail = authRegisterDto.email;
    return;
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

  @Get('unconfirmed')
  @Render('pages/auth/unconfirmed')
  unconfirmed() {
    return;
  }

  @Get('/resend-confirmation')
  async resendConfirmation(@Request() req, @Res() res) {
    const email = req.session.unconfirmedEmail;
    req.session.unconfirmedEmail = undefined;

    if (!email) {
      return res.redirect('/auth/login');
    }
    await this.authService.resendConfirmationCode(email);
    return res.render('pages/auth/confirmationSent');
  }

  @Get('/reset-password')
  @UseGuards(AuthenticatedGuard)
  @Redirect('reset-password-confirm')
  async resetPassword(@User() user: UserType) {
    return this.authService.startResetPassword(user);
  }

  @Get('/reset-password-confirm')
  @Render('pages/auth/resetPassword')
  async resetPasswordConfirm() {
    return;
  }

  @Post('/reset-password-confirm')
  @ValidateForm()
  @Render('pages/auth/passwordResetConfirmation')
  async confirmNewPassword(@Body() confirmPasswordDto: ConfirmPasswordDto) {
    return this.authService.confirmPassword(confirmPasswordDto);
  }

  @Get('/delete-user')
  @UseGuards(AuthenticatedGuard)
  @Render('pages/auth/deleteUser')
  async deleteUser() {
    return;
  }

  @Get('/delete-user-confirmation')
  @UseGuards(AuthenticatedGuard)
  @Render('pages/auth/deleteUserConfirm')
  async deleteUserConfirm(@User() user: UserType, @Request() req) {
    await this.authService.deleteUser(user);
    req.session.destroy();
    return;
  }
}
