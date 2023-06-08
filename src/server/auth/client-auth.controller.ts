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
import { ErrorFilter } from '../error.filter';
import { AuthExceptionFilter } from './filters/authException.filter';
import { ViewDataInterceptor } from '../../view-data-interceptor.service';
import { ValidateForm } from '../form-validation';
import { AuthenticatedGuard } from './authenticated.guard';
import EmailAddressDto from './types/EmailAddress.dto';
import { ClientAuthService } from './client-auth.service';
import { MagicLinkGuard } from './magic-link.guard';
import { User } from '../user/user.decorator';
import type { User as UserType } from '../auth/types/User';
import { SignUpGuard } from './sign-up.guard';

@UseFilters(AuthExceptionFilter)
@UseFilters(ErrorFilter)
@UseInterceptors(ViewDataInterceptor)
@Controller('auth')
export class ClientAuthController {
  constructor(private clientAuthService: ClientAuthService) {}

  @Get('register')
  @Render('pages/auth/register')
  register() {
    return;
  }

  @Post('register')
  @ValidateForm()
  @UseGuards(SignUpGuard)
  @Redirect('/auth/unconfirmed')
  async registerPost(@Body() emailAddressDto: EmailAddressDto, @Request() req) {
    await this.clientAuthService.registerUser(emailAddressDto);
    req.session.unconfirmedEmail = emailAddressDto.email;
    return;
  }

  @Get('invalid-domain')
  @Render('pages/auth/invalidDomain')
  invalidDomain() {
    return;
  }

  @Get('/resend-confirmation')
  async resendConfirmation(@Request() req, @Res() res) {
    const email = req.session.unconfirmedEmail;
    req.session.unconfirmedEmail = undefined;

    if (!email) {
      return res.redirect('/auth/login');
    }
    await this.clientAuthService.resendConfirmationCode(email);
    return res.render('pages/auth/confirmationSent');
  }
  @Get('login')
  @Render('pages/auth/login')
  login() {
    return;
  }

  @Post('/login')
  @ValidateForm()
  @Redirect('/auth/email-sent')
  async loginPost(@Body() emailAddressDto: EmailAddressDto, @Request() req) {
    const initiationResponse =
      await this.clientAuthService.initiateAuthentication(emailAddressDto);
    req.session.challengeSession = initiationResponse.Session;
    req.session.challengeUsername =
      initiationResponse.ChallengeParameters.USERNAME;

    return initiationResponse;
  }

  @Get('/email-sent')
  @Render('pages/auth/emailSent')
  getEmailSent() {
    return;
  }

  @UseGuards(MagicLinkGuard)
  @Get('/access-code')
  @Redirect('/search')
  getSubmitAccessCode(@Request() req) {
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
    await this.clientAuthService.deleteUser(user);
    req.session.destroy();
    return;
  }
}
