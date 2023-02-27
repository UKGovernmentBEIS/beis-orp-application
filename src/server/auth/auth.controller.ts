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
import ForgotPasswordResetDto from './types/ForgotPasswordResetDto';
import type { User as UserType } from '../auth/types/User';
import { AuthenticatedGuard } from './authenticated.guard';
import EmailAddressDto from './types/EmailAddress.dto';
import ResetPasswordDto from './types/ResetPassword.dto';

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
  @Render('pages/auth/resetPasswordWithOldPassword')
  async resetPassword() {
    return {};
  }

  @Post('/reset-password')
  @UseGuards(AuthenticatedGuard)
  @ValidateForm()
  @Redirect('change-password-success')
  async postResetPassword(
    @User() user: UserType,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(user, resetPasswordDto);
  }

  @Get('/change-password-success')
  @Render('pages/auth/passwordResetConfirmation')
  async resetPasswordSuccess() {
    return;
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

  @Get('/new-password')
  @Render('pages/auth/newPassword')
  async getNewPassword() {
    return;
  }

  @Post('/new-password')
  @ValidateForm()
  @Redirect('set-new-password')
  async generateNewPassword(
    @Body() { email }: EmailAddressDto,
    @Request() req,
  ) {
    const res = await this.authService.startForgotPassword(email);
    req.session.email = email;
    return res;
  }

  @Get('/set-new-password')
  @Render('pages/auth/resetPasswordWithCode')
  async setNewPassword(@Request() req) {
    const email = req.session.email;
    return { email };
  }

  @Post('/set-new-password')
  @ValidateForm()
  @Redirect('forgot-password-success')
  async confirmForgottenPassword(
    @Body() confirmPasswordDto: ForgotPasswordResetDto,
  ) {
    return this.authService.confirmForgotPassword(confirmPasswordDto);
  }

  @Get('/forgot-password-success')
  @Render('pages/auth/passwordForgotConfirmation')
  async forgotPasswordSuccess() {
    return;
  }

  @Get('/limit-exceeded')
  @Render('pages/auth/limitExceeded')
  async limitExceeded() {
    return;
  }
}
